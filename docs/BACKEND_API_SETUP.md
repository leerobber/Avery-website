# Backend / API setup guide

The site itself is static (HTML + Tailwind CDN + vanilla JS) and needs no build step.
But real features — auth, the contact form, Stripe checkout — need server-side code
somewhere, since none of those can safely run with secrets in the browser.

## Recommended: the Worker's own fetch handler

The site deploys as a [Worker with static assets](https://developers.cloudflare.com/workers/static-assets/):
`public/` is served via the `ASSETS` binding, and `src/worker.js` is the single entry
point for everything else. No separate service to host or pay for.

- Add routes by checking `url.pathname` in `src/worker.js`'s `fetch()` handler before
  falling through to `env.ASSETS.fetch(request)`.
- `/api/contact` is already stubbed in there.
- Access secrets via the `env` argument passed into `fetch(request, env)`, sourced from
  the Worker's environment variables/secrets — never hardcode them.

This covers most needs: form handling, Stripe session creation/webhooks, calling
Supabase from the server side with the service-role key.

## Supabase for auth + data

1. Create a project at [supabase.com](https://supabase.com).
2. Project Settings → API: copy the **Project URL** and **anon public key** into
   `SUPABASE_URL` / `SUPABASE_ANON_KEY` (safe for the browser — Row Level Security
   policies are what actually protect your data, so set those up before storing
   anything sensitive).
3. The **service_role key** is server-only: use it exclusively inside `src/worker.js`
   (`env.SUPABASE_SERVICE_ROLE_KEY`), never in `public/assets/js/main.js` or any client code.
4. Client-side auth (sign up/sign in) can talk to Supabase directly from the browser
   using the anon key and the [`@supabase/supabase-js`](https://supabase.com/docs/reference/javascript/introduction)
   library loaded via CDN/ESM import — no backend required for basic auth flows.
5. Server-side privileged operations (reading across users, admin actions) go through
   a route in `src/worker.js` using the service-role key.

## When you outgrow a single Worker

If you need heavier compute, stateful logic, or a framework-specific runtime, consider
[Durable Objects](https://developers.cloudflare.com/durable-objects/) for state, or a
separate backend service reached via `fetch()`. Keep CORS in mind if it's hosted on a
different origin than the Worker.

## Local development

```bash
npm install -g wrangler
wrangler dev
```

This serves `public/` and runs `src/worker.js` locally, reading variables from a local
`.dev.vars` file (see Wrangler's docs) rather than `.env` directly — copy the relevant
keys from `.env.example` into `.dev.vars` for local testing.
