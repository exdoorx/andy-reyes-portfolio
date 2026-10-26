import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{js,jsx}", "cloudflare/*.test.js", "tests/**/*.test.js"],
    globals: true,
  },
});
