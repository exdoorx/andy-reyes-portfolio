// Cloudflare Worker: validates contact-form posts, then stores them in Supabase.
// Why use it: your Supabase service key stays on the server (as a secret), never in the browser,
// and the Worker can reject spam before it reaches the database.
//
// Security posture (v2):
//   - CORS/Origin resolution is FAIL-CLOSED: if ALLOWED_ORIGIN is unset or the
//     request Origin does not match, POST/OPTIONS requests are rejected. Set
//     ALLOWED_ORIGIN to your site URL (or explicitly to "*" to opt into open CORS).
//   - GET /messages is an admin-only endpoint: the request must carry a valid
//     Supabase access token, which is verified directly against Supabase Auth,
//     and the user id must match the ADMIN_USER_IDS secret (comma-separated
//     Supabase auth user UUIDs). Compared via SHA-256 digests (timing-safe).
//   - Optional bot protection: if TURNSTILE_SECRET_KEY is set as a secret, the
//     POST body must contain a valid turnstile token (invisible widget on the form).
//   - Logs are structured and secret-free: methods, paths, status codes only.
//
// Deploy:
//   npm install -g wrangler
//   cd cloudflare
//   wrangler secret put SUPABASE_SERVICE_KEY   (paste the service_role key when asked)
//   wrangler secret put ADMIN_USER_IDS         (comma-separated auth user UUIDs)
//   wrangler secret put TURNSTILE_SECRET_KEY   (optional)
//   wrangler deploy
//
// Then set VITE_CONTACT_ENDPOINT in the project's .env to the Worker URL.

const MAX_BODY_BYTES = 4096;

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Resolve the ACAO value for a request. Returns null when the request must be
 * treated as unauthorized (fail-closed default).
 */
function resolveAllowedOrigin(request, env) {
  const configured = (env.ALLOWED_ORIGIN ?? "").trim();
  if (configured === "*") return "*";
  const origin = (request.headers.get("Origin") ?? "").trim();
  if (!configured || !origin || origin !== configured) return null;
  return origin;
}

function response(body, status, origin, extra = {}) {
  return new Response(body === null ? null : JSON.stringify(body), {
    status,
    headers: {
      ...(body === null ? {} : { "Content-Type": "application/json" }),
      ...(origin ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" } : {}),
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
      "Access-Control-Max-Age": "86400",
      ...extra,
    },
  });
}

const reject = (status, error, origin) => response({ error }, status, origin);

/** Verify a Cloudflare Turnstile token (only when the secret is configured). */
async function verifyTurnstile(data, env, origin) {
  if (!env.TURNSTILE_SECRET_KEY) return true; // control disabled — do not claim bot protection
  if (typeof data.turnstileToken !== "string" || !data.turnstileToken) return false;
  const form = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY,
    response: data.turnstileToken,
  });
  if (origin) form.set("remoteip-origin", origin);
  const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form,
  }).then((res) => res.json());
  return Boolean(result.success);
}

/** Verify a Supabase access token and return its user id, or null. */
async function verifySupabaseToken(request, env) {
  const auth = request.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token || token.length < 20) return null;
  const result = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: env.SUPABASE_SERVICE_KEY,
    },
  });
  if (!result.ok) return null;
  const user = await result.json().catch(() => null);
  return typeof user?.id === "string" ? user.id : null;
}

/** Constant-time-ish membership check of a user id against the admin allowlist. */
async function isAdminUser(userId, env) {
  const allowlist = (env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((id) => id.trim().toLowerCase())
    .filter(Boolean);
  if (allowlist.length === 0) return false;
  const candidate = await sha256(userId.toLowerCase());
  const candidates = await Promise.all(allowlist.map((id) => sha256(id)));
  return candidates.some((digest) => digest === candidate);
}

function log(method, path, status, extra = "") {
  console.log(`[contact-worker] ${method} ${path} -> ${status}${extra ? " " + extra : ""}`);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = resolveAllowedOrigin(request, env);

    if (request.method === "OPTIONS") {
      // Preflight: 204 with no body. Only proceed when the origin resolves.
      if (!origin) {
        log("OPTIONS", url.pathname, 403, "(origin not allowed)");
        return reject(403, "Origin not allowed", "*");
      }
      return response(null, 204, origin);
    }

    if (!origin) {
      log(request.method, url.pathname, 403, "(origin not allowed or unset)");
      return reject(403, "Origin not allowed", "*");
    }

    if (env.SUPABASE_URL && !/^https:\/\/[a-z0-9.-]+\.supabase\.co$/i.test(env.SUPABASE_URL)) {
      log(request.method, url.pathname, 500, "(bad SUPABASE_URL config)");
      return reject(500, "Server not configured correctly", origin);
    }

    // ----- Admin read path -----------------------------------------------
    if (request.method === "GET" && url.pathname.replace(/\/$/, "") === "/messages") {
      const userId = await verifySupabaseToken(request, env);
      if (!userId || !(await isAdminUser(userId, env))) {
        log("GET", "/messages", 401);
        return reject(401, "Unauthorized", origin);
      }

      const result = await fetch(
        `${env.SUPABASE_URL}/rest/v1/contact_messages?select=name,email,message,created_at&order=created_at.desc&limit=50`,
        {
          headers: {
            apikey: env.SUPABASE_SERVICE_KEY,
            Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
          },
        },
      );
      if (!result.ok) {
        log("GET", "/messages", 502);
        return reject(502, "Could not read messages", origin);
      }
      const messages = await result.json();
      log("GET", "/messages", 200);
      return response({ messages }, 200, origin);
    }

    // ----- Contact submission path ----------------------------------------
    if (request.method !== "POST") {
      log(request.method, url.pathname, 405);
      return reject(405, "Method not allowed", origin);
    }

    if (!(request.headers.get("content-type") ?? "").includes("application/json")) {
      log("POST", url.pathname, 415);
      return reject(415, "Expected application/json", origin);
    }

    let data;
    try {
      const raw = await request.text();
      if (raw.length > MAX_BODY_BYTES) {
        log("POST", url.pathname, 413);
        return reject(413, "Payload too large", origin);
      }
      data = JSON.parse(raw);
    } catch {
      log("POST", url.pathname, 400, "(invalid JSON)");
      return reject(400, "Invalid JSON", origin);
    }

    // Honeypot: bots that fill hidden fields get a silent 200.
    if (
      data &&
      typeof data === "object" &&
      !Array.isArray(data) &&
      typeof data.yourWebsite === "string" &&
      data.yourWebsite.trim()
    ) {
      log("POST", url.pathname, 200, "(honeypot)");
      return response({ ok: true }, 200, origin);
    }

    if (!(await verifyTurnstile(data, env, origin))) {
      log("POST", url.pathname, 403, "(turnstile)");
      return reject(403, "Bot verification failed", origin);
    }

    // Strict field allowlist — mass-assignment impossible.
    const name = typeof data?.name === "string" ? data.name.trim() : "";
    const email = typeof data?.email === "string" ? data.email.trim() : "";
    const message = typeof data?.message === "string" ? data.message.trim() : "";

    if (!name || name.length > 100) {
      log("POST", url.pathname, 400, "(invalid name)");
      return reject(400, "Invalid name", origin);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
      log("POST", url.pathname, 400, "(invalid email)");
      return reject(400, "Invalid email", origin);
    }
    if (!message || message.length > 2000) {
      log("POST", url.pathname, 400, "(invalid message)");
      return reject(400, "Invalid message", origin);
    }

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
      log("POST", url.pathname, 502, "(save failed)");
      return reject(502, "Could not save message", origin);
    }

    log("POST", url.pathname, 200);
    return response({ ok: true }, 200, origin);
  },
};
