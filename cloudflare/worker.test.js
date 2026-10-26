import { describe, it, expect, afterEach, vi } from "vitest";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

async function loadWorker() {
  const mod = await import("./worker.js");
  return mod.default;
}

const SITE = "https://areyes-eight.vercel.app";

async function postMessage(worker, env, body, origin = SITE) {
  return worker.fetch(
    new Request("https://worker.example.workers.dev/", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: origin },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
    env,
  );
}

describe("contact worker — request integrity", () => {
  const env = {
    ALLOWED_ORIGIN: SITE,
    SUPABASE_URL: "https://myproject123.supabase.co",
    SUPABASE_SERVICE_KEY: "service-key",
    ADMIN_USER_IDS: "11111111-1111-1111-1111-111111111111",
  };

  it("rejects POSTs with a mismatched Origin (no CORS echo)", async () => {
    const worker = await loadWorker(env);
    const res = await postMessage(worker, env, { name: "x" }, "https://evil.example");
    expect(res.status).toBe(403);
  });

  it("rejects POSTs with no Origin header when an allowlist is configured", async () => {
    const worker = await loadWorker(env);
    const res = await worker.fetch(
      new Request("https://worker.example.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "a", email: "a@b.co", message: "hi" }),
      }),
      env,
    );
    expect(res.status).toBe(403);
  });

  it("rejects malformed JSON with 400", async () => {
    const worker = await loadWorker(env);
    const res = await postMessage(worker, env, "{not json");
    expect(res.status).toBe(400);
  });

  it("rejects oversized payloads with 413", async () => {
    const worker = await loadWorker(env);
    const res = await postMessage(worker, env, { name: "x".repeat(5000) });
    expect(res.status).toBe(413);
  });

  it("rejects invalid field values with 400 (strict allowlist)", async () => {
    const worker = await loadWorker(env);
    const bad = [
      { name: "", email: "a@b.co", message: "hi" },
      { name: "x".repeat(101), email: "a@b.co", message: "hi" },
      { name: "ok", email: "not-an-email", message: "hi" },
      { name: "ok", email: "a@b.co", message: "y".repeat(2001) },
      { name: 123, email: "a@b.co", message: "hi" }, // wrong type: mass-assignment ignored
    ];
    for (const body of bad) {
      const res = await postMessage(worker, env, body);
      expect(res.status).toBe(400);
    }
  });

  it("silently accepts honeypot submissions with 200 (no DB write)", async () => {
    const worker = await loadWorker(env);
    const res = await postMessage(worker, env, {
      name: "bot",
      email: "bot@bot.co",
      message: "spam",
      yourWebsite: "canary",
    });
    expect(res.status).toBe(200);
  });

  it("denies GET /messages without a token", async () => {
    const worker = await loadWorker(env);
    const res = await worker.fetch(
      new Request("https://worker.example.workers.dev/messages", {
        headers: { Origin: SITE },
      }),
      env,
    );
    expect(res.status).toBe(401);
  });

  it("denies GET /messages with a garbage token", async () => {
    // Stub upstream auth verification to fail (invalid token).
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("unauthorized", { status: 401 })),
    );
    const worker = await loadWorker(env);
    const res = await worker.fetch(
      new Request("https://worker.example.workers.dev/messages", {
        headers: { Origin: SITE, Authorization: "Bearer garbage-token-value-123456" },
      }),
      env,
    );
    expect(res.status).toBe(401);
  });

  it("returns 403 preflight for unknown origins", async () => {
    const worker = await loadWorker(env);
    const res = await worker.fetch(
      new Request("https://worker.example.workers.dev/", {
        method: "OPTIONS",
        headers: { Origin: "https://evil.example", "Access-Control-Request-Method": "POST" },
      }),
      env,
    );
    expect(res.status).toBe(403);
  });

  it("allows preflight for the configured origin", async () => {
    const worker = await loadWorker(env);
    const res = await worker.fetch(
      new Request("https://worker.example.workers.dev/", {
        method: "OPTIONS",
        headers: { Origin: SITE, "Access-Control-Request-Method": "POST" },
      }),
      env,
    );
    expect(res.status).toBe(204);
  });
});

describe("contact worker — fail-closed configuration", () => {
  it("rejects all methods when ALLOWED_ORIGIN is not configured", async () => {
    const worker = await loadWorker({
      SUPABASE_URL: "https://myproject123.supabase.co",
      SUPABASE_SERVICE_KEY: "service-key",
    });
    const res = await worker.fetch(
      new Request("https://worker.example.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: "https://anything.example" },
        body: JSON.stringify({ name: "a", email: "a@b.co", message: "hi" }),
      }),
      {},
    );
    expect(res.status).toBe(403);
  });

  it("rejects when SUPABASE_URL is malformed (misconfiguration signals 500)", async () => {
    const worker = await loadWorker({
      ALLOWED_ORIGIN: SITE,
      SUPABASE_URL: "https://not-supabase.example.com",
      SUPABASE_SERVICE_KEY: "service-key",
    });
    const res = await worker.fetch(
      new Request("https://worker.example.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: SITE },
        body: JSON.stringify({ name: "a", email: "a@b.co", message: "hi" }),
      }),
      {
        ALLOWED_ORIGIN: SITE,
        SUPABASE_URL: "https://not-supabase.example.com",
        SUPABASE_SERVICE_KEY: "service-key",
      },
    );
    expect(res.status).toBe(500);
  });
});
