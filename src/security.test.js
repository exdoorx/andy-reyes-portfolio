import { describe, it, expect, vi, afterEach } from "vitest";

// The redirect sanitizer under test must be the REAL implementation used by
// Login.jsx — not a copy defined inside the test file.
const { sanitizeHashRedirect } = await import("./lib/redirect.js");

describe("open-redirect defense (lib/redirect.js)", () => {
  it("passes through safe local hashes", () => {
    expect(sanitizeHashRedirect("#admin")).toBe("#admin");
    expect(sanitizeHashRedirect("#projects")).toBe("#projects");
    expect(sanitizeHashRedirect(" #admin ")).toBe("#admin");
    expect(sanitizeHashRedirect("")).toBe("#admin"); // empty -> default, not an error
  });

  it("rejects absolute URLs to external origins", () => {
    expect(sanitizeHashRedirect("https://evil.example")).toBe("#admin");
    expect(sanitizeHashRedirect("https://evil.example#admin")).toBe("#admin");
    expect(sanitizeHashRedirect("http://evil.example/admin")).toBe("#admin");
  });

  it("rejects unsafe URI schemes", () => {
    expect(sanitizeHashRedirect("javascript:alert(1)")).toBe("#admin");
    expect(sanitizeHashRedirect("data:text/html,<script>alert(1)</script>")).toBe("#admin");
    expect(sanitizeHashRedirect("vbscript:msgbox")).toBe("#admin");
  });

  it("rejects protocol-relative and path-style redirect values", () => {
    expect(sanitizeHashRedirect("//evil.example")).toBe("#admin");
    expect(sanitizeHashRedirect("/admin")).toBe("#admin");
    expect(sanitizeHashRedirect("admin")).toBe("#admin"); // missing hash prefix
  });

  it("rejects hash payloads containing separators or encoding tricks", () => {
    expect(sanitizeHashRedirect("#admin;https://evil.example")).toBe("#admin");
    expect(sanitizeHashRedirect("#%2F%2Fevil.example")).toBe("#admin");
    expect(sanitizeHashRedirect("#admin\tjavascript:alert(1)")).toBe("#admin");
  });

  it("treats non-string input as the fallback", () => {
    expect(sanitizeHashRedirect(null)).toBe("#admin");
    expect(sanitizeHashRedirect(undefined)).toBe("#admin");
    expect(sanitizeHashRedirect({ url: "#admin" })).toBe("#admin");
  });
});

describe("contact delivery env contract (lib/contact.js)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  // Regression F1: contact.js must read the CANONICAL variable name that
  // .env actually defines, or Supabase delivery silently never activates.
  it("activates supabase mode with the canonical publishable key variable", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://myproject123.supabase.co");
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "x".repeat(40));
    const contact = await import("./lib/contact.js");
    expect(contact.contactMode).toBe("supabase");
  });

  it("prefers the worker mode when an endpoint is configured", async () => {
    vi.stubEnv("VITE_CONTACT_ENDPOINT", "https://my-worker.example.workers.dev");
    vi.stubEnv("VITE_SUPABASE_URL", "https://myproject123.supabase.co");
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "x".repeat(40));
    const contact = await import("./lib/contact.js");
    expect(contact.contactMode).toBe("worker");
  });

  it("never treats placeholder values as configuration", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://your-project-id.supabase.co");
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "your-supabase-anon-key");
    const contact = await import("./lib/contact.js");
    expect(contact.contactMode).toBe("mailto");
  });

  it("falls back to mailto when nothing is configured", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "");
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "");
    vi.stubEnv("VITE_CONTACT_ENDPOINT", "");
    const contact = await import("./lib/contact.js");
    expect(contact.contactMode).toBe("mailto");
  });
});
