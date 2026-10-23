import { useState } from "react";
import { demoInput, demoLabel, demoResult, peso } from "./demoStyles";

const plans = {
  Basic: { multiplier: 1, perks: "Hospitalization and emergency cover" },
  Standard: { multiplier: 1.45, perks: "Basic cover plus outpatient care and medicines" },
  Premium: { multiplier: 1.9, perks: "Standard cover plus critical illness and accident cover" },
};

export default function InsuranceDemo() {
  const [age, setAge] = useState(26);
  const [plan, setPlan] = useState("Standard");
  const [coverage, setCoverage] = useState(500000);

  const ageFactor = age < 30 ? 1 : age < 45 ? 1.35 : age < 60 ? 1.9 : 2.6;
  const monthly = Math.round((coverage / 1000) * 0.9 * ageFactor * plans[plan].multiplier);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
        <label htmlFor="insurance-age" className={demoLabel}>
          Your age: <span className="text-slate-900 dark:text-white">{age}</span>
        </label>
        <input
          id="insurance-age"
          type="range"
          min="18"
          max="70"
          value={age}
          onChange={(event) => setAge(Number(event.target.value))}
          className="w-full accent-brand-500"
        />
        <div className="mt-1 flex justify-between text-[11px] text-slate-500">
          <span>18</span>
          <span>70</span>
        </div>
      </div>

      <fieldset>
        <legend className={demoLabel}>Select a plan</legend>
        <div className="grid grid-cols-3 gap-2">
          {Object.keys(plans).map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setPlan(name)}
              aria-pressed={plan === name}
              className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                plan === name
                  ? "bg-brand-600 text-white dark:bg-brand-500"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {plans[plan].perks}
        </p>
      </fieldset>

      <div className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
        <label htmlFor="insurance-coverage" className={demoLabel}>
          Coverage: <span className="text-slate-900 dark:text-white">{peso(coverage)}</span>
        </label>
        <input
          id="insurance-coverage"
          type="range"
          min="100000"
          max="2000000"
          step="50000"
          value={coverage}
          onChange={(event) => setCoverage(Number(event.target.value))}
          className="w-full accent-accent-500"
        />
        <div className="mt-1 flex justify-between text-[11px] text-slate-500">
          <span>₱100,000</span>
          <span>₱2,000,000</span>
        </div>
      </div>

      <div className={demoResult} aria-live="polite">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Estimated monthly premium
        </p>
        <p className="gradient-text mt-1 font-display text-4xl font-semibold">
          {peso(monthly)}
        </p>
        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          Illustrative calculation only. Not an insurance quote.
        </p>
      </div>

      <noscript>
        <p className={demoInput}>This demo needs JavaScript enabled.</p>
      </noscript>
    </div>
  );
}
