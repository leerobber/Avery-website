# Backend / API setup guide

The site itself is static (HTML + Tailwind CDN + vanilla JS) and needs no build step.
But real features — auth, the contact form, Stripe checkout — need server-side code
somewhere, since none of those can safely run with secrets in the browser.

## Recommended: Cloudflare Pages Functions

Because the site already deploys to Cloudflare Pages, the lowest-friction option is
[Pages Functions](https://developers.cloudflare.com/pages/functions/): plain JS/TS
files under `functions/`, deployed automatically alongside the static site, no
separate service to host or pay for.

- `functions/api/contact.js` → available at `/api/contact` (already stubbed in).
- `functions/api/create-checkout-session.js` → `/api/create-checkout-session` (see
  `docs/STRIPE_INTEGRATION.md`).
- File-based routing: `functions/api/foo.js` becomes `/api/foo`,
  `functions/api/users/[id].js` becomes `/api/users/:id`, etc.
- Access secrets via the `env` argument (`onRequestPost({ request, env })`), sourced
  from the Pages project's environment variables — never hardcode them.

This covers most needs: form handling, Stripe session creation/webhooks, calling
Supabase from the server side with the service-role key.

## Supabase for auth + data

1. Create a project at [supabase.com](https://supabase.com).
2. Project Settings → API: copy the **Project URL** and **anon public key** into
   `SUPABASE_URL` / `SUPABASE_ANON_KEY` (safe for the browser — Row Level Security
   policies are what actually protect your data, so set those up before storing
   anything sensitive).
3. The **service_role key** is server-only: use it exclusively inside Pages Functions
   (`env.SUPABASE_SERVICE_ROLE_KEY`), never in `assets/js/main.js` or any client code.
4. Client-side auth (sign up/sign in) can talk to Supabase directly from the browser
   using the anon key and the [`@supabase/supabase-js`](https://supabase.com/docs/reference/javascript/introduction)
   library loaded via CDN/ESM import — no backend required for basic auth flows.
5. Server-side privileged operations (reading across users, admin actions) go through
   a Pages Function using the service-role key.

## When you outgrow Pages Functions

If you need long-running jobs, heavier compute, WebSockets, or a framework-specific
runtime, consider a dedicated backend (e.g. a small Node/Express service, or a
Cloudflare Worker with Durable Objects for stateful logic) and point the frontend at
it via `fetch()`. Keep CORS in mind if it's hosted on a different origin than the
Pages site.

## Local development

```bash
npm install -g wrangler
wrangler pages dev . --compatibility-date=2024-01-01
```

This serves the static site and runs `functions/` locally, reading variables from a
local `.dev.vars` file (see Wrangler's docs) rather than `.env` directly — copy the
relevant keys from `.env.example` into `.dev.vars` for local testing.
