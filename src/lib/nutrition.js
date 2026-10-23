export const activityLevels = [
  ["Sedentary (desk job)", 1.2],
  ["Light (1–3 workouts/week)", 1.375],
  ["Moderate (3–5 workouts/week)", 1.55],
  ["Very active (6–7 workouts/week)", 1.725],
];

export const goals = {
  "Lose weight": { adjustment: 0.85, proteinRange: [1.6, 2.2] },
  "Maintain weight": { adjustment: 1, proteinRange: [1.2, 1.6] },
  "Build muscle": { adjustment: 1.1, proteinRange: [1.6, 2.2] },
};

export function calculateNutrition({ sex, age, kg, cm, activity, goal }) {
  const bmr = 10 * kg + 6.25 * cm - 5 * age + (sex === "male" ? 5 : -161);
  const selectedGoal = goals[goal];
  if (!selectedGoal) throw new Error("Choose a valid goal.");

  const kcal = Math.round(bmr * activity * selectedGoal.adjustment);
  const [low, high] = selectedGoal.proteinRange;
  const proteinLow = Math.round(kg * low);
  const proteinHigh = Math.round(kg * high);
  const protein = Math.round((proteinLow + proteinHigh) / 2);
  const fat = Math.round((kcal * 0.25) / 9);
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));

  return {
    kcal,
    protein,
    proteinLow,
    proteinHigh,
    fat,
    carbs,
  };
}
