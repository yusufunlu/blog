# Chat backend (Cloudflare Worker)

Backend for the chat widget on https://yusufunlu.github.io/blog.

Flow: browser widget → this Worker (`POST /chat`) → Anthropic Claude → reply.
The Worker bundles your resume + blog-post list as system context so the model
can answer recruiter questions ("How strong is Yusuf in Java?") grounded in your
actual experience.

## One-time setup

1. **Install Node 18+ and pnpm/npm** if you don't already have them.
2. **Install Wrangler** (Cloudflare's CLI):
   ```
   cd workers/chat
   npm install
   ```
3. **Log in to Cloudflare** (opens a browser):
   ```
   npx wrangler login
   ```
4. **Get an Anthropic API key** from https://console.anthropic.com/settings/keys
   and store it as a Worker secret (you'll be prompted to paste it):
   ```
   npx wrangler secret put ANTHROPIC_API_KEY
   ```
5. **Create the KV namespace for daily usage caps:**
   ```
   npx wrangler kv namespace create CHAT_COUNTERS
   ```
   Wrangler prints something like `id = "abc123..."`. Open `wrangler.toml` and
   replace `REPLACE_WITH_KV_NAMESPACE_ID` with that id.
6. **Deploy:**
   ```
   npx wrangler deploy
   ```
   Wrangler prints the deployed URL, e.g.
   `https://yusuf-blog-chat.<your-subdomain>.workers.dev`.
7. **Wire the frontend to the Worker URL.** In the repo root create a
   `.env.production` file (gitignored by the Gatsby defaults — add it to
   `.gitignore` if not):
   ```
   GATSBY_CHAT_API_URL=https://yusuf-blog-chat.<your-subdomain>.workers.dev/chat
   ```
   Then redeploy the blog (`npm run deploy` in the repo root).

## Usage caps

Two daily caps protect your Anthropic spend. Both reset at UTC midnight.

| Var | Default | What it limits |
|---|---|---|
| `DAILY_GLOBAL_CAP` | `100` | Total successful replies site-wide per day |
| `DAILY_PER_IP_CAP` | `10` | Successful replies per visitor IP per day |

Edit either number in `wrangler.toml` and re-deploy to change it; no code change
needed. The counters live in Workers KV and auto-expire after 36 hours.

The Worker returns `remaining: { you, site }` in every successful response, and
the widget shows "N messages left today" once the visitor is within 3 of their
cap. When either cap is hit the next request returns `429` with a message the
widget displays verbatim — pointing the visitor at your email so they can still
reach you.

## Updating the knowledge base

- **Resume changed?** Edit `resume.txt` and re-run:
  ```
  npm run build-context
  npx wrangler deploy
  ```
- **New blog post?** The build script walks `src/pages/*/index.md` automatically,
  so just re-run the two commands above.

## Local development

Start the Worker locally:
```
npx wrangler dev
```
This serves `http://localhost:8787`. Point the frontend at it by setting
`GATSBY_CHAT_API_URL=http://localhost:8787/chat` and running `npm start` in the
repo root. `localhost:8000` is already in the Worker's `ALLOWED_ORIGINS`.

## Configuration

Everything you'll want to tweak lives in `wrangler.toml`:

| Var | Default | Purpose |
|---|---|---|
| `ALLOWED_ORIGINS` | `https://yusufunlu.github.io,http://localhost:8000` | CORS allowlist, comma-separated. Add your custom domain here if you move off GitHub Pages. |
| `MODEL` | `claude-haiku-5-5` | Anthropic model id. Swap for Sonnet/Opus for better answers at higher cost. |
| `MAX_TOKENS` | `600` | Max tokens in each reply. |

The Worker also enforces a basic in-memory rate limit (15 requests per IP per
minute). Adjust the constants at the top of `src/index.js` if you need more.

## Cost notes

Claude Haiku is the cheapest Anthropic model. A typical answer in this setup is
~2k input tokens (system prompt) + ~300 output tokens. At current Haiku pricing
that's a small fraction of a cent per message; a few thousand recruiter messages
per month cost well under $5. Cloudflare Workers' free tier covers 100k
requests/day.
