// Contact delivery has three modes:
//   1. VITE_CONTACT_ENDPOINT -> Cloudflare Worker (recommended for production)
//   2. Supabase URL + anon key -> direct insert protected by RLS
//   3. Neither -> the form falls back to the visitor's email app
//
// Never put a Supabase service-role key in a VITE_* variable.

const rawEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT?.trim();
const rawUrl = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/$/, "");
// Canonical variable name — must match src/lib/supabase.js. (The old
// VITE_SUPABASE_ANON_KEY name silently broke the Supabase contact mode.)
const rawKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

const looksLikePlaceholder = (value) =>
  !value || /YOUR[-_]|example\.com|placeholder/i.test(value);

const endpoint = looksLikePlaceholder(rawEndpoint) ? "" : rawEndpoint;
const supabaseUrl =
  !looksLikePlaceholder(rawUrl) && /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(rawUrl)
    ? rawUrl
    : "";
const supabaseKey =
  !looksLikePlaceholder(rawKey) && rawKey.length > 30 ? rawKey : "";

export const contactMode = endpoint
  ? "worker"
  : supabaseUrl && supabaseKey
    ? "supabase"
    : "mailto";

export const hasDirectContactMode = contactMode !== "mailto";

const request = async (url, options) => {
  const response = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) {
    throw new Error(`Contact request failed with status ${response.status}.`);
  }
};

export async function sendContactMessage({ name, email, message }) {
  const payload = {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
  };

  if (contactMode === "worker") {
    await request(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return;
  }

  if (contactMode === "supabase") {
    await request(`${supabaseUrl}/rest/v1/contact_messages`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });
    return;
  }

  throw new Error("No contact endpoint is configured.");
}

export function buildMailtoLink({ name, email, message, to }) {
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
  return `mailto:${to}?subject=${subject}&body=${body}`;
}
