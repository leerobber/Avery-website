// Cloudflare Pages Function: POST /api/contact
//
// This is a stub. Wire it up to a real destination (email provider, Supabase
// table, CRM) per docs/BACKEND_API_SETUP.md before relying on it in production.
export async function onRequestPost({ request }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { name, email, message } = body;
  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // TODO: forward to email/Supabase/CRM instead of just logging.
  console.log('Contact form submission:', { name, email, message });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
