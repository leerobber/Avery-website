// Worker entry point: serves the static site (public/) via the ASSETS binding
// and handles a couple of server-side API routes. Wire real Stripe/Supabase
// logic in here per docs/STRIPE_INTEGRATION.md and docs/BACKEND_API_SETUP.md.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContact(request);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const { name, email, message } = body ?? {};
  if (!name || !email || !message) {
    return jsonResponse({ error: 'Missing required fields' }, 400);
  }

  // TODO: forward to email/Supabase/CRM instead of just logging.
  console.log('Contact form submission:', { name, email, message });

  return jsonResponse({ ok: true }, 200);
}

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
