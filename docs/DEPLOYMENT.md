# Deploying to Cloudflare Workers

The site ships as a [Cloudflare Worker with static assets](https://developers.cloudflare.com/workers/static-assets/):
`public/` holds the static site, `src/worker.js` handles the couple of server-side
routes (like `/api/contact`), and `wrangler.jsonc` ties them together. No build step is
required.

> Note: Cloudflare Pages and its Git integration have been superseded by Workers +
> static assets. This repo originally targeted Pages; it's been migrated (Pages
> Functions → a `src/worker.js` Worker, `wrangler pages deploy` → `wrangler deploy`).

## Two deploy paths — you likely already have one active

**1. Cloudflare's native Workers Builds git integration.** A Worker project named
`avery-website` already exists in the connected Cloudflare account and is wired to
auto-build on every push to this repo (you'll see a `cloudflare-workers-and-pages[bot]`
comment with build status on each PR). This needs **no GitHub secrets at all** — it's
managed entirely from the Cloudflare dashboard under **Workers & Pages → avery-website
→ Settings → Build**.

**2. The `.github/workflows/deploy.yml` GitHub Actions workflow**, added for an
explicit, auditable CI step. It deploys the same Worker via `wrangler deploy` using
`cloudflare/wrangler-action`.

Both target the same Worker (`avery-website`), so running both isn't harmful — the
one that finishes last "wins" — but it's redundant. Pick one:

- Prefer the **native integration** (option 1) if you want zero-secret, zero-maintenance
  deploys — it's already working.
- Prefer **GitHub Actions** (option 2) if you want deploy status as a required PR check,
  or plan to add build/test steps before deploying. If so, consider disabling the native
  build in the Cloudflare dashboard to avoid duplicate deploy noise on every push.

## One-time setup for the GitHub Actions path

1. **Create a Cloudflare API token**
   - Cloudflare dashboard → profile icon → **My Profile** → **API Tokens** → **Create Token**.
   - Use the **"Edit Cloudflare Workers"** template, or a custom token with
     **Account → Workers Scripts → Edit** permission.
   - Copy the token — you won't be able to view it again.

2. **Find your Cloudflare Account ID**
   - Cloudflare dashboard → **Workers & Pages** → Account ID is in the right-hand sidebar.

3. **Add both as GitHub repository secrets**
   - GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.
   - Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

4. **Push to `main`** — the workflow deploys the Worker on every push.

## Where the site is live

```
https://avery-website.<your-subdomain>.workers.dev
```

Check **Workers & Pages → avery-website** in the dashboard for the exact `*.workers.dev`
URL, or add a custom domain there under **Custom domains**. Once you know the real
domain, update the placeholder URLs in `public/robots.txt` and `public/sitemap.xml`.

## Environment variables / secrets for the Worker

`src/worker.js` (and any future backend logic there) reads secrets/variables from the
Worker's own environment, not from `.env` (that's for local dev only — see
`.env.example`). Set them under Cloudflare dashboard → **Workers & Pages** →
`avery-website` → **Settings** → **Variables and Secrets**, for each environment you use,
then redeploy.
