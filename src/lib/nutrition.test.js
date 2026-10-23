import { describe, expect, it } from "vitest";
import { calculateNutrition } from "./nutrition";

describe("calculateNutrition", () => {
  it("computes a daily target for a moderate active adult", () => {
    expect(
      calculateNutrition({
        sex: "male",
        age: 26,
        kg: 65,
        cm: 168,
        activity: 1.375,
        goal: "Maintain weight",
      }),
    ).toMatchObject({
      kcal: 2166,
      protein: 91,
      proteinLow: 78,
      proteinHigh: 104,
      fat: 60,
      carbs: 316,
    });
  });

  it("adjusts calories upward for building muscle", () => {
    const maintain = calculateNutrition({
      sex: "male",
      age: 30,
      kg: 70,
      cm: 175,
      activity: 1.55,
      goal: "Maintain weight",
    });
    const build = calculateNutrition({
      sex: "male",
      age: 30,
      kg: 70,
      cm: 175,
      activity: 1.55,
      goal: "Build muscle",
    });

    expect(build.kcal).toBeGreaterThan(maintain.kcal);
  });

  it("adjusts calories downward for losing weight", () => {
    const maintain = calculateNutrition({
      sex: "female",
      age: 28,
      kg: 60,
      cm: 165,
      activity: 1.375,
      goal: "Maintain weight",
    });
    const lose = calculateNutrition({
      sex: "female",
      age: 28,
      kg: 60,
      cm: 165,
      activity: 1.375,
      goal: "Lose weight",
    });

    expect(lose.kcal).toBeLessThan(maintain.kcal);
  });

  it("rejects an unknown goal", () => {
    expect(() =>
      calculateNutrition({ sex: "male", age: 30, kg: 70, cm: 175, activity: 1.375, goal: "bad" }),
    ).toThrow("Choose a valid goal.");
  });
});
