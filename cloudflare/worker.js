// Cloudflare Worker: validates contact-form posts, then stores them in Supabase.
// Why use it: your Supabase service key stays on the server (as a secret), never in the browser,
// and the Worker can reject spam before it reaches the database.
//
// Deploy:
//   npm install -g wrangler
//   cd cloudflare
//   wrangler secret put SUPABASE_SERVICE_KEY     (paste the service_role key when asked)
//   wrangler deploy
// Then point the site's form at your Worker URL (see README, section "Cloudflare Worker").

const json = (body, status, origin) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });

export default {
  async fetch(request, env) {
    const origin = env.ALLOWED_ORIGIN || "*";

    if (request.method === "OPTIONS") return json({}, 204, origin);
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405, origin);

    let data;
    try {
      data = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400, origin);
    }

    const name = String(data.name ?? "").trim();
    const email = String(data.email ?? "").trim();
    const message = String(data.message ?? "").trim();

    if (!name || name.length > 100) return json({ error: "Invalid name" }, 400, origin);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 200)
      return json({ error: "Invalid email" }, 400, origin);
    if (!message || message.length > 2000) return json({ error: "Invalid message" }, 400, origin);

    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/contact_messages`, {
      method: "POST",
      headers: {
        apikey: env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (!res.ok) return json({ error: "Could not save message" }, 502, origin);
    return json({ ok: true }, 200, origin);
  },
};
