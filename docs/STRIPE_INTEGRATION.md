# Stripe integration guide

The current pricing section (`index.html#pricing`) is static placeholder markup with no
real checkout wired up. This is the path to a working, secure integration.

## Why you need a backend for this

Stripe Checkout/Payment Intents must be created **server-side** with your secret key.
Never put `STRIPE_SECRET_KEY` in client-side JavaScript — treat it like a password. The
publishable key (`pk_...`) is the only Stripe key that's safe in the browser.

This project ships as static HTML with Cloudflare Pages Functions available in
`functions/` for exactly this kind of server-side logic — see
`docs/BACKEND_API_SETUP.md` for the broader picture.

## 1. Set up Stripe

1. Create a [Stripe account](https://dashboard.stripe.com/register) if you don't have one.
2. Stay in **Test mode** while building.
3. Dashboard → **Developers** → **API keys**: copy the **Publishable key** and **Secret key**.
4. Dashboard → **Product catalog** → **Add product** for each pricing tier (Starter, Pro,
   Enterprise, or whatever the real plans end up being). Each price gets a `price_id`
   (e.g. `price_1AbCdEf...`) — you'll reference these when creating Checkout Sessions.

## 2. Store the keys

Add to `.env` locally (never commit it) and to Cloudflare Pages project environment
variables for deployed environments:

```
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...   # from step 4 below
```

## 3. Create a Checkout Session endpoint

Add a Pages Function, e.g. `functions/api/create-checkout-session.js`:

```js
export async function onRequestPost({ request, env }) {
  const { priceId } = await request.json();

  const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      mode: 'subscription', // or 'payment' for one-time
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      success_url: `${env.PUBLIC_SITE_URL}/success`,
      cancel_url: `${env.PUBLIC_SITE_URL}/#pricing`,
    }),
  });

  const session = await stripeRes.json();
  return new Response(JSON.stringify({ url: session.url }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

Then from each pricing card's button, `fetch('/api/create-checkout-session', { method:
'POST', body: JSON.stringify({ priceId: 'price_...' }) })` and redirect the browser to
the returned `url`.

(Using Stripe's raw HTTP API here to avoid a Node SDK/build step, consistent with this
being a build-free static site. If you later add a bundler, the official `stripe` npm
SDK is more ergonomic.)

## 4. Handle webhooks

Create `functions/api/stripe-webhook.js` to receive events (`checkout.session.completed`,
`invoice.paid`, `customer.subscription.deleted`, etc.) and update your own records
(e.g. a Supabase table — see `docs/BACKEND_API_SETUP.md`).

1. Stripe dashboard → **Developers** → **Webhooks** → **Add endpoint**.
2. Endpoint URL: `https://<your-domain>/api/stripe-webhook`.
3. Select the events you need.
4. Copy the **Signing secret** into `STRIPE_WEBHOOK_SECRET`.
5. Verify the signature in your handler using the `Stripe-Signature` header before
   trusting the payload (see Stripe's [webhook signature docs](https://stripe.com/docs/webhooks/signatures)).

## 5. Go-live checklist

- [ ] Real products/prices created in **Live mode** (test mode data doesn't carry over).
- [ ] Live keys set in Cloudflare Pages **Production** environment variables only.
- [ ] Webhook endpoint re-created for Live mode with its own signing secret.
- [ ] Success/cancel URLs point at the real production domain.
- [ ] Terms/Privacy pages linked from checkout (Stripe may require this for some account types).
