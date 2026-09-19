# Deploying to Cloudflare Pages

This repo deploys via GitHub Actions (`.github/workflows/deploy.yml`) using
[`cloudflare/pages-action`](https://github.com/cloudflare/pages-action). No
local build step is required — it's a static site plus a couple of
[Pages Functions](https://developers.cloudflare.com/pages/functions/) in
`functions/`.

## One-time setup

1. **Create a Cloudflare API token**
   - Cloudflare dashboard → click your profile icon → **My Profile** → **API Tokens** → **Create Token**.
   - Use the **"Edit Cloudflare Workers"** template (it covers Pages) or create a custom
     token with the **Account → Cloudflare Pages → Edit** permission.
   - Copy the token — you won't be able to view it again.

2. **Find your Cloudflare Account ID**
   - Cloudflare dashboard → **Workers & Pages** → the Account ID is shown in the
     right-hand sidebar (also visible on any zone's Overview page).

3. **Add both as GitHub repository secrets**
   - GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.
   - Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

4. **Push to `main`**
   - The workflow creates the Cloudflare Pages project (`avery-website`) automatically
     on first deploy if it doesn't already exist, and deploys on every push to `main`.
   - Pull requests get their own preview deployment URL, posted back to the PR by the action.

Once the first deploy succeeds, the production site is live at:

```
https://avery-website.pages.dev
```

(Cloudflare will show you the exact `*.pages.dev` subdomain it assigned — it depends on
project name availability in your account.)

## Alternative: connect directly in the dashboard

If you'd rather not use GitHub Actions, you can connect the repo directly instead:

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Authorize GitHub and select this repository.
3. Build settings: **no build command**, output directory `/` (project root).
4. Click **Save and Deploy**.

Using both at once is fine, but pick one as your source of truth to avoid confusing
deploy history — the dashboard-connected build and the Action would otherwise both try
to manage the same project.

## Custom domain

Once live, add a custom domain under the Pages project → **Custom domains** → **Set up a
custom domain**, and follow the DNS instructions shown there.

## Environment variables / secrets for Pages Functions

The contact form stub in `functions/api/contact.js` and any future backend logic that
lives in `functions/` reads environment variables from the Cloudflare Pages project
settings, not from `.env` (that file is for local dev only — see `.env.example`).

Cloudflare dashboard → Pages project → **Settings** → **Environment variables** → add
each variable for both **Production** and **Preview**, then redeploy.
