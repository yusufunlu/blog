import { RESUME, POSTS, BLOG_URL } from './context.js';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

// Short-burst anti-abuse (per Worker isolate, in-memory). Stops someone from
// hammering the endpoint in a single minute. The daily caps below are the real
// budget guard.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 15;
const rateBuckets = new Map();

// KV counter TTL: 36h is long enough that today's key survives past midnight in
// every timezone but still auto-deletes, so KV stays small.
const COUNTER_TTL_SECONDS = 60 * 60 * 36;

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

function corsHeaders(origin, allowed) {
  const allowlist = allowed.split(',').map(s => s.trim()).filter(Boolean);
  const allow = allowlist.includes(origin) ? origin : allowlist[0] || '*';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function rateLimited(ip) {
  const now = Date.now();
  const bucket = rateBuckets.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  bucket.count += 1;
  rateBuckets.set(ip, bucket);
  return bucket.count > RATE_LIMIT_MAX_REQUESTS;
}

function buildSystemPrompt() {
  const postList = POSTS.map(
    p => `- "${p.title}" (${p.date}) — ${p.spoiler}`
  ).join('\n');

  return `You are a helpful assistant answering questions about Yusuf Unlu for recruiters and other visitors to his personal blog.

Answer only from the resume and blog-post list below. If the visitor asks something not covered, say so honestly and point them at the blog (${BLOG_URL}) or suggest they email ${extractEmail()}.

Guidelines:
- Be concise and specific. Quote concrete experience (companies, years, tech) when relevant.
- When asked about proficiency in a technology, cite the roles where Yusuf used it and for how long.
- When a blog post is relevant, mention its title so the visitor can find it on ${BLOG_URL}.
- Never invent experience, employers, dates, or credentials.
- Reply in the visitor's language if it is clearly not English.

=== RESUME ===
${RESUME}

=== BLOG POSTS ===
${postList}`;
}

function extractEmail() {
  const match = RESUME.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  return match ? match[0] : 'the email on the resume';
}

async function callAnthropic(apiKey, model, maxTokens, system, messages) {
  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system,
      messages,
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Anthropic ${res.status}: ${text}`);
  }
  const data = JSON.parse(text);
  const reply = (data.content || [])
    .filter(c => c.type === 'text')
    .map(c => c.text)
    .join('')
    .trim();
  return reply || "Sorry, I couldn't generate a reply.";
}

function normalizeHistory(history) {
  if (!Array.isArray(history)) return [];
  const out = [];
  for (const m of history) {
    if (!m || typeof m.content !== 'string') continue;
    const role = m.role === 'assistant' ? 'assistant' : 'user';
    const content = m.content.trim();
    if (!content) continue;
    out.push({ role, content: content.slice(0, 2000) });
  }
  // Keep the last ~10 messages to keep prompts cheap.
  return out.slice(-10);
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin, env.ALLOWED_ORIGINS || '');
    const json = (status, body) =>
      new Response(JSON.stringify(body), {
        status,
        headers: { ...headers, 'content-type': 'application/json' },
      });

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== 'POST' || new URL(request.url).pathname !== '/chat') {
      return new Response('Not found', { status: 404, headers });
    }

    if (!env.ANTHROPIC_API_KEY) {
      return json(500, { error: 'Server missing ANTHROPIC_API_KEY' });
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (rateLimited(ip)) {
      return json(429, { error: 'Rate limit exceeded, slow down.' });
    }

    // Daily caps (per-IP + global). Soft-fail if KV isn't configured yet so
    // the Worker still works during initial setup; after you create the KV
    // namespace and paste its id into wrangler.toml, caps go live.
    const dailyGlobalCap = parseInt(env.DAILY_GLOBAL_CAP || '100', 10);
    const dailyPerIpCap = parseInt(env.DAILY_PER_IP_CAP || '10', 10);
    const day = todayKey();
    const globalKey = `global:${day}`;
    const ipKey = `ip:${ip}:${day}`;

    let globalCount = 0;
    let ipCount = 0;
    if (env.CHAT_COUNTERS) {
      const [g, p] = await Promise.all([
        env.CHAT_COUNTERS.get(globalKey),
        env.CHAT_COUNTERS.get(ipKey),
      ]);
      globalCount = parseInt(g || '0', 10);
      ipCount = parseInt(p || '0', 10);

      if (globalCount >= dailyGlobalCap) {
        return json(429, {
          error: `This chat is busy today — the site-wide daily limit of ${dailyGlobalCap} messages has been reached. Please try again tomorrow, or email ${extractEmail()} directly.`,
        });
      }
      if (ipCount >= dailyPerIpCap) {
        return json(429, {
          error: `You've reached today's limit of ${dailyPerIpCap} messages. Please come back tomorrow, or email ${extractEmail()} directly.`,
        });
      }
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json(400, { error: 'Invalid JSON body' });
    }

    const question = typeof body.question === 'string' ? body.question.trim() : '';
    if (!question) {
      return json(400, { error: 'Missing "question" field' });
    }
    if (question.length > 2000) {
      return json(400, { error: 'Question too long (max 2000 chars)' });
    }

    const history = normalizeHistory(body.history);
    const messages = [...history, { role: 'user', content: question }];
    const model = env.MODEL || 'claude-haiku-5-5';
    const maxTokens = parseInt(env.MAX_TOKENS || '600', 10);

    try {
      const reply = await callAnthropic(
        env.ANTHROPIC_API_KEY,
        model,
        maxTokens,
        buildSystemPrompt(),
        messages
      );

      // Count this successful reply against both daily caps. Fire-and-forget
      // via waitUntil so we don't delay the response. KV is eventually
      // consistent, so caps may overrun by a couple under heavy concurrency —
      // acceptable for a budget guardrail.
      if (env.CHAT_COUNTERS && ctx && ctx.waitUntil) {
        ctx.waitUntil(
          Promise.all([
            env.CHAT_COUNTERS.put(globalKey, String(globalCount + 1), {
              expirationTtl: COUNTER_TTL_SECONDS,
            }),
            env.CHAT_COUNTERS.put(ipKey, String(ipCount + 1), {
              expirationTtl: COUNTER_TTL_SECONDS,
            }),
          ]).catch(() => {})
        );
      }

      return json(200, {
        answer: reply,
        remaining: env.CHAT_COUNTERS
          ? { you: dailyPerIpCap - ipCount - 1, site: dailyGlobalCap - globalCount - 1 }
          : undefined,
      });
    } catch (err) {
      return json(502, {
        error: 'Upstream LLM error',
        detail: String(err.message || err),
      });
    }
  },
};
