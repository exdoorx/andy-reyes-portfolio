import { describe, expect, it } from "vitest";
import { solveExpression } from "./mathSolver";

describe("solveExpression", () => {
  it("respects operator precedence", () => {
    expect(solveExpression("2 + 2 * 3").answer).toBe("8");
  });

  it("evaluates parentheses and powers", () => {
    expect(solveExpression("(4 + 6) * 5 - 2^3").answer).toBe("42");
  });

  it("supports implicit multiplication", () => {
    expect(solveExpression("3(x - 2) = 12").answer).toBe("x = 6");
  });

  it("solves a linear equation", () => {
    expect(solveExpression("2x + 3 = 11").answer).toBe("x = 4");
  });

  it("solves an equation with the variable on both sides", () => {
    expect(solveExpression("5x - 4 = 2x + 8").answer).toBe("x = 4");
  });

  it("rejects division by zero", () => {
    expect(() => solveExpression("1 / 0")).toThrow("Can't divide by zero.");
  });

  it("rejects two variables or malformed input", () => {
    expect(() => solveExpression("x =")).toThrow("The expression ended too early.");
  });

  it("rejects equations that are not linear", () => {
    expect(() => solveExpression("x^2 = 4")).toThrow("This demo solves linear equations only");
  });
});
