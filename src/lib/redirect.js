// Sanitize user-influenced redirect targets to local, same-page destinations only.
// Prevents open redirects (https://evil.example) and javascript:/data: URI injection.
const SAFE_HASH = /^#[a-z0-9-]*$/i;

export function sanitizeHashRedirect(input, fallback = "#admin") {
  if (typeof input !== "string") return fallback;
  const value = input.trim();
  if (!value.startsWith("#")) return fallback; // absolute URLs, protocol-relative //, paths, javascript: are all rejected
  if (!SAFE_HASH.test(value)) return fallback; // blocks #abc;#def tricks and encoded characters
  return value;
}
