# Avery Website

A static marketing site for Avery — HTML + [Tailwind CSS](https://tailwindcss.com/) (via
CDN, no build step) + vanilla JavaScript, deployed as a
[Cloudflare Worker with static assets](https://developers.cloudflare.com/workers/static-assets/).

> The content in `public/index.html` is placeholder copy scaffolded to get a real deploy
> pipeline running end to end. Swap in real product copy, pricing, and imagery before
> launch.

## Local development

No build step — just serve `public/`:

```bash
cd public && python3 -m http.server 8080
# or
npx serve public
```

To also run `src/worker.js` (the `/api/contact` route etc.) locally:

```bash
npm install -g wrangler
wrangler dev
```

## Project structure

```
public/index.html        Landing page
public/404.html           Not-found page
public/assets/css/        Small overrides on top of Tailwind utility classes
public/assets/js/         Footer year, contact form submission
public/_headers, _redirects  Static asset headers/redirects
src/worker.js              Worker entry point: serves public/, handles /api/* routes
wrangler.jsonc              Worker config (name, assets directory, etc.)
.github/workflows/          CI/CD: deploys the Worker on push to main (optional — see docs/DEPLOYMENT.md)
docs/                       Deployment, Stripe, and backend setup guides
```

## Deployment

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — there are two independent deploy paths
(Cloudflare's native git integration, already connected and building with no secrets
needed; and the GitHub Actions workflow in this repo). Pick one; the doc explains the
tradeoffs and the one-time secret setup for the Actions path.

## Backend integrations

- [`docs/BACKEND_API_SETUP.md`](docs/BACKEND_API_SETUP.md) — Supabase auth/data +
  adding routes to `src/worker.js`.
- [`docs/STRIPE_INTEGRATION.md`](docs/STRIPE_INTEGRATION.md) — wiring up real checkout.
- [`.env.example`](.env.example) — required environment variables.

## Analytics

Google Analytics is wired up with tracking ID `G-257655184` in `public/index.html` (and
`public/404.html`).
