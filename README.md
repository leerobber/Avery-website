# Avery Website

A static marketing site for Avery — HTML + [Tailwind CSS](https://tailwindcss.com/) (via
CDN, no build step) + vanilla JavaScript, deployed to [Cloudflare Pages](https://pages.cloudflare.com/).

> The content in `index.html` is placeholder copy scaffolded to get a real deploy
> pipeline running end to end. Swap in real product copy, pricing, and imagery before
> launch.

## Local development

No build step — just serve the files:

```bash
python3 -m http.server 8080
# or
npx serve .
```

To also run the `functions/` (Cloudflare Pages Functions) locally:

```bash
npm install -g wrangler
wrangler pages dev . --compatibility-date=2024-01-01
```

## Project structure

```
index.html              Landing page
404.html                 Not-found page
assets/css/style.css     Small overrides on top of Tailwind utility classes
assets/js/main.js        Footer year, contact form submission
functions/api/           Cloudflare Pages Functions (server-side)
_headers, _redirects     Cloudflare Pages config
.github/workflows/       CI/CD: deploys to Cloudflare Pages on push to main
docs/                     Deployment, Stripe, and backend setup guides
```

## Deployment

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the Cloudflare Pages + GitHub Actions
setup (the two repo secrets you need to add, and how the workflow works).

## Backend integrations

- [`docs/BACKEND_API_SETUP.md`](docs/BACKEND_API_SETUP.md) — Supabase auth/data +
  Cloudflare Pages Functions.
- [`docs/STRIPE_INTEGRATION.md`](docs/STRIPE_INTEGRATION.md) — wiring up real checkout.
- [`.env.example`](.env.example) — required environment variables.

## Analytics

Google Analytics is wired up with tracking ID `G-257655184` in `index.html` (and
`404.html`).
