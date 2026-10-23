import { useMemo, useState } from "react";
import { activityLevels, calculateNutrition, goals } from "../../lib/nutrition";
import { demoInput, demoLabel } from "./demoStyles";

export default function CalorieDemo() {
  const [sex, setSex] = useState("male");
  const [age, setAge] = useState(26);
  const [kg, setKg] = useState(65);
  const [cm, setCm] = useState(168);
  const [activity, setActivity] = useState(1.375);
  const [goal, setGoal] = useState("Maintain weight");

  const result = useMemo(
    () => calculateNutrition({ sex, age, kg, cm, activity, goal }),
    [sex, age, kg, cm, activity, goal],
  );

  const numberChange = (setter) => (event) => {
    const value = Number(event.target.value);
    setter(Number.isFinite(value) ? Math.max(0, value) : 0);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="calorie-sex" className={demoLabel}>
            Sex
          </label>
          <select
            id="calorie-sex"
            value={sex}
            onChange={(event) => setSex(event.target.value)}
            className={demoInput}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label htmlFor="calorie-age" className={demoLabel}>
            Age
          </label>
          <input
            id="calorie-age"
            type="number"
            min="14"
            max="100"
            value={age}
            onChange={numberChange(setAge)}
            className={demoInput}
          />
        </div>
        <div>
          <label htmlFor="calorie-weight" className={demoLabel}>
            Weight (kg)
          </label>
          <input
            id="calorie-weight"
            type="number"
            min="30"
            max="300"
            value={kg}
            onChange={numberChange(setKg)}
            className={demoInput}
          />
        </div>
        <div>
          <label htmlFor="calorie-height" className={demoLabel}>
            Height (cm)
          </label>
          <input
            id="calorie-height"
            type="number"
            min="100"
            max="250"
            value={cm}
            onChange={numberChange(setCm)}
            className={demoInput}
          />
        </div>
      </div>

      <div>
        <label htmlFor="calorie-activity" className={demoLabel}>
          Activity level
        </label>
        <select
          id="calorie-activity"
          value={activity}
          onChange={(event) => setActivity(Number(event.target.value))}
          className={demoInput}
        >
          {activityLevels.map(([label, value]) => (
            <option key={label} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className={demoLabel}>Goal</legend>
        <div className="grid grid-cols-3 gap-2">
          {Object.keys(goals).map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setGoal(name)}
              aria-pressed={goal === name}
              className={`rounded-xl px-2 py-2 text-xs font-semibold transition ${
                goal === name
                  ? "bg-brand-600 text-white dark:bg-brand-500"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-5 text-center" aria-live="polite">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Estimated daily target
        </p>
        <p className="gradient-text mt-1 font-display text-4xl font-semibold">
          {result.kcal.toLocaleString()} kcal
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <div className="rounded-xl bg-white/70 p-2 dark:bg-white/5">
            <strong className="block text-slate-950 dark:text-white">{result.protein} g</strong>
            <span className="text-xs text-slate-500 dark:text-slate-400">Protein</span>
          </div>
          <div className="rounded-xl bg-white/70 p-2 dark:bg-white/5">
            <strong className="block text-slate-950 dark:text-white">{result.carbs} g</strong>
            <span className="text-xs text-slate-500 dark:text-slate-400">Carbs</span>
          </div>
          <div className="rounded-xl bg-white/70 p-2 dark:bg-white/5">
            <strong className="block text-slate-950 dark:text-white">{result.fat} g</strong>
            <span className="text-xs text-slate-500 dark:text-slate-400">Fat</span>
          </div>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Protein range: {result.proteinLow}–{result.proteinHigh} g/day. General estimate using
          the Mifflin-St Jeor equation — not medical advice.
        </p>
      </div>
    </div>
  );
}
