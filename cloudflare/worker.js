// Cloudflare Worker: validates contact-form posts, then stores them in Supabase.
// Why use it: your Supabase service key stays on the server (as a secret), never in the browser,
// and the Worker can reject spam before it reaches the database.
//
// Deploy:
//   npm install -g wrangler
//   cd cloudflare
//   wrangler secret put SUPABASE_SERVICE_KEY   (paste the service_role key when asked)
//   wrangler deploy
//
// Then set VITE_CONTACT_ENDPOINT in the project's .env to the Worker URL.

const MAX_BODY_BYTES = 4096;

const allowedOrigin = (env) => env.ALLOWED_ORIGIN || "*";

function response(body, status, origin, extra = {}) {
  return new Response(body === null ? null : JSON.stringify(body), {
    status,
    headers: {
      ...(body === null ? {} : { "Content-Type": "application/json" }),
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
      ...extra,
    },
  });
}

const reject = (status, error, origin) => response({ error }, status, origin);

export default {
  async fetch(request, env) {
    const origin = allowedOrigin(env);

    if (request.method === "OPTIONS") {
      // 204 responses must not have a body.
      return response(null, 204, origin);
    }

    if (request.method !== "POST") return reject(405, "Method not allowed", origin);

    if (env.SUPABASE_URL && !/^https:\/\/[a-z0-9.-]+\.supabase\.co$/i.test(env.SUPABASE_URL)) {
      return reject(500, "Server not configured correctly", origin);
    }

    if (!(request.headers.get("content-type") ?? "").includes("application/json")) {
      return reject(415, "Expected application/json", origin);
    }

    let data;
    try {
      const raw = await request.text();
      if (raw.length > MAX_BODY_BYTES) {
        return reject(413, "Payload too large", origin);
      }
      data = JSON.parse(raw);
    } catch {
      return reject(400, "Invalid JSON", origin);
    }

    if (
      data &&
      typeof data === "object" &&
      !Array.isArray(data) &&
      typeof data.yourWebsite === "string" &&
      data.yourWebsite.trim()
    ) {
      return response({ ok: true }, 200, origin);
    }

    const name = typeof data?.name === "string" ? data.name.trim() : "";
    const email = typeof data?.email === "string" ? data.email.trim() : "";
    const message = typeof data?.message === "string" ? data.message.trim() : "";

    if (!name || name.length > 100) return reject(400, "Invalid name", origin);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
      return reject(400, "Invalid email", origin);
    }
    if (!message || message.length > 2000) return reject(400, "Invalid message", origin);

    const saveResponse = await fetch(`${env.SUPABASE_URL}/rest/v1/contact_messages`, {
      method: "POST",
      headers: {
        apikey: env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (!saveResponse.ok) {
      return reject(502, "Could not save message", origin);
    }

    return response({ ok: true }, 200, origin);
  },
};
