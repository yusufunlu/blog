---
title: Adding an AI Chatbot to a Static Blog
date: '2026-11-16'
spoiler: Cloudflare Workers, Claude Haiku, and the auth model when there's no auth
---

I wanted recruiters and visitors to be able to ask questions about my background without having to scroll through blog posts or read the resume end to end. Something like: "How strong is Yusuf in Java?" and a grounded answer comes back.

This post is how I built that, and the one bit most people get wrong — the auth model between the browser and the backend.

## The constraint

This blog is a Gatsby static site served from GitHub Pages. GitHub Pages serves only static files; it will not run server code. So any LLM call has to happen somewhere else, because the API key cannot be in the browser bundle. Anyone can "View Source" on a static page and steal an embedded key.

So the architecture ended up being three pieces:

```
Browser (Gatsby widget on github.io)
    │  POST /chat { question, history }
    ▼
Cloudflare Worker (yusuf-blog-chat.workers.dev)
    │  POST /v1/messages   x-api-key: sk-ant-***
    ▼
Anthropic API (Claude Haiku)
```

The Worker is the only place the Anthropic key exists. The browser never sees it.

## The backend: Cloudflare Worker + Claude Haiku

Cloudflare Workers are serverless JavaScript at the edge. Free tier gives 100k requests/day, which is far more than a portfolio chatbot will ever need. Deploy is one `wrangler deploy` command.

The Worker is ~150 lines. The core of it:

```javascript
export default {
  async fetch(request, env, ctx) {
    // ...CORS, rate limit, cap checks...
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-5-5',
        max_tokens: 600,
        system: buildSystemPrompt(),
        messages: [...history, { role: 'user', content: question }],
      }),
    });
    const data = await res.json();
    return Response.json({ answer: data.content[0].text });
  },
};
```

The `ANTHROPIC_API_KEY` is a Cloudflare Worker secret, set once with `wrangler secret put ANTHROPIC_API_KEY`. It's injected into the Worker at runtime as `env.ANTHROPIC_API_KEY`, never serialized into source.

### Grounding the model in my resume

Claude knows nothing about me by default. To make it answer specific questions correctly, the system prompt includes my resume text and a list of blog post titles with their spoilers. That's it — no vector database, no RAG, no fancy retrieval. The whole context is about 10 KB, which costs a small fraction of a cent per message on Haiku.

There's a small Node script that walks `src/pages/*/index.md`, extracts frontmatter, and emits a `context.js` file the Worker imports. Re-run it whenever I add a post or edit the resume:

```
node workers/chat/scripts/build-context.js
wrangler deploy
```

## The frontend: a floating widget

The widget is a React component in `src/components/ChatWidget.js` — a pink bubble bottom-right, opens a chat panel, handles streaming messages. Nothing special.

The interesting bit is where it's mounted. Early on I put it inside `Layout.js`, which Gatsby renders fresh on every page. Clicking a blog post link reloaded the widget and wiped the conversation. The fix is `wrapRootElement` in `gatsby-browser.js` and `gatsby-ssr.js`:

```javascript
// gatsby-browser.js
export const wrapRootElement = ({ element }) => (
  <>
    {element}
    <ChatWidget />
  </>
);
```

`wrapRootElement` mounts above the router, so the widget instance persists across client-side navigation.

For surviving a hard refresh, I added `sessionStorage` persistence — messages, remaining-count, and open-state all round-trip through it. One thing to watch: SSR has no `window`, so the initial `useState` must be deterministic (matching what the server rendered) and a `useEffect` restores from storage after hydration. Otherwise React complains about hydration mismatch.

## The auth question that most people get wrong

Now the interesting part. Look at the architecture diagram again. There is **no auth** on the browser → Worker hop. The widget hits `POST /chat` with no bearer token, no API key, no cookie. The Worker is a public endpoint anyone can curl.

That is on purpose, and it's the only correct design. Here's why.

| Hop | Auth | Credential lives where |
|---|---|---|
| Browser → Worker | **None** | N/A |
| Worker → Anthropic | API key as `x-api-key` | `ANTHROPIC_API_KEY` Cloudflare secret |
| Worker → KV counters | Automatic Cloudflare binding | Cloudflare manages it |

You cannot put a secret in a static HTML page without it being readable. Every "secret" I embed in the browser bundle is public. So there's nothing to authenticate the browser *with*. CORS is often confused for auth — it is not. CORS only stops a different website's JavaScript from calling my Worker in a visitor's browser. It does nothing against `curl` from a terminal or a Python script.

If browser → Worker has no auth, the question becomes: what stops abuse?

## Usage caps: the real budget guard

Three layers, all in the Worker:

1. **Short-burst per-IP rate limit** — 15 requests per minute from the same IP, held in the Worker isolate's memory. Stops someone hammering the endpoint in a tight loop.
2. **Daily per-IP cap** — 10 successful replies per visitor IP per day, counted in Cloudflare Workers KV. Stops one person from monopolizing the day's quota.
3. **Daily site-wide cap** — 100 successful replies across all visitors per day. This is the real ceiling on my Anthropic spend.

KV is eventually consistent, so the daily cap can overrun by a couple under heavy concurrency. For a budget guardrail on a portfolio site, that noise is fine.

When a cap is hit, the Worker returns `429` with a friendly message the widget renders verbatim: *"You've reached today's limit of 10 messages. Please come back tomorrow, or email me directly."*

And the Worker returns `remaining: { you, site }` on every successful reply, so the widget can show "3 messages left today" once the visitor is within 3 of their cap.

## Anthropic's own backstop

Even if I had none of the above caps, I wouldn't be at risk of unlimited spend — because Anthropic's prepaid credit model is itself a hard ceiling.

I topped up with $5. Every call debits that balance. When it reaches $0, every subsequent request returns `400 credit_balance_too_low` and nothing more gets charged. The worst case for an attacker is **the credits I prepaid**, no more.

Two things to double-check on the Anthropic side:

- **Keep auto-reload off.** If you turn on auto-reload, there is no hard cap — credits refill in a loop and an attacker can run up a real bill. Leave it off unless you have a reason.
- **Optionally set a spend limit** in Billing → Limits. Belts and suspenders.

So the layered defense ends up being: my 10/IP cap → my 100/day cap → Anthropic's prepaid balance → optional monthly spend limit. Each one is a weaker guarantee than the one before. The point of the daily cap isn't that Anthropic wouldn't eventually stop a runaway — it's that **my cap stretches $5 across weeks of real recruiter use**, instead of letting it drain in one afternoon of abuse and leaving the chatbot dead the next day for an actual visitor.

## Costs

Claude Haiku is around $0.80/M input tokens and $4/M output tokens. A typical answer in this setup is roughly 2.5k input tokens (the system prompt with resume + blog list) and ~300 output tokens, so one chat message costs on the order of $0.003.

At the 100/day site-wide cap, worst case is about $0.30/day → **$9/month at maximum abuse**. Realistic recruiter traffic is far below that — my $5 credits should last months.

Cloudflare Workers free tier covers 100k requests/day; KV free tier covers 1k writes/day and 100k reads/day. The whole backend is free to run.

## What I'd change next

- **Turnstile** (Cloudflare's free captcha) if someone decides to rotate IPs and chew through the daily cap for fun. Ten lines to add.
- **Streaming** responses so the first words appear in <1s instead of waiting for the whole reply. Anthropic's SSE endpoint + a Workers `TransformStream` would do it.
- **Embeddings over full post bodies** if I write more posts and want deeper "what does Yusuf think about X?" style answers. For now, titles + spoilers in the system prompt are enough.

The whole thing took about an afternoon end to end. The repo is public — the Worker is in `workers/chat/`, the widget in `src/components/ChatWidget.js`.
