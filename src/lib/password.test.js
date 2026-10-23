import { describe, expect, it } from "vitest";
import { analyzePassword } from "./password";

describe("analyzePassword", () => {
  it("returns no score for an empty password", () => {
    const result = analyzePassword("");
    expect(result.score).toBe(0);
    expect(result.label).toBe("Waiting for input");
    expect(result.entropy).toBe(0);
  });

  it("scores a weak short password", () => {
    const result = analyzePassword("12345678");
    expect(result.score).toBeLessThan(3);
    expect(result.label).toBe("Very weak");
  });

  it("scores a mixed password above a short weak one", () => {
    const weak = analyzePassword("12345678");
    const better = analyzePassword("Abcdefgh1234");
    expect(better.score).toBeGreaterThan(weak.score);
    expect(better.checks.map((check) => check.key)).toEqual(["lower", "upper", "number", "symbol"]);
  });

  it("flags length as a separate requirement", () => {
    const result = analyzePassword("Abcdefgh1234");
    expect(result.lengthOk).toBe(true);
  });
});
