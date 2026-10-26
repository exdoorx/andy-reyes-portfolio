// Admin-only read path for contact messages.
//
// The anon key must never be able to SELECT from contact_messages (that is the
// point of the RLS design). Instead the authenticated admin session token is
// forwarded to the Cloudflare Worker (same origin as the contact endpoint),
// which verifies the token against Supabase Auth server-side and only accepts
// the explicit admin allowlist (ADMIN_USER_IDS secret).
// Never put a Supabase service-role key in a VITE_* variable.

const rawEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT?.trim();
const looksLikePlaceholder = (value) =>
  !value || /YOUR[-_]|example\.com|placeholder/i.test(value);

const base = looksLikePlaceholder(rawEndpoint) ? "" : rawEndpoint.replace(/\/messages\/?$/, "/");

export const isAdminEndpointConfigured = Boolean(base);

const request = async (url, options) => {
  const response = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) {
    throw new Error(`Messages request failed with status ${response.status}.`);
  }
  return response.json();
};

/**
 * Fetch contact messages via the trusted worker. Throws on any failure so the
 * dashboard can surface an explicit error state (no silent empty lists).
 * @param {string} accessToken Supabase access token of the signed-in admin.
 */
export async function fetchAdminMessages(accessToken) {
  if (!base) throw new Error("Messages endpoint is not configured.");
  if (!accessToken) throw new Error("Not authenticated.");
  return request(`${base.replace(/\/$/, "")}/messages`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });
}
