import { useState } from "react";
import { analyzePassword } from "../../lib/password";
import { demoInput, demoLabel } from "./demoStyles";

export default function PasswordDemo() {
  const [password, setPassword] = useState("");
  const result = analyzePassword(password);

  const strengthWidth = `${(result.score / 5) * 100}%`;
  const strengthTone =
    result.score <= 2
      ? "bg-red-500"
      : result.score <= 3
        ? "bg-amber-500"
        : "bg-emerald-500";

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="password-input" className={demoLabel}>
          Password
        </label>
        <input
          id="password-input"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={demoInput}
          placeholder="Enter a password to analyze"
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {result.checks.map((check) => (
          <div
            key={check.key}
            className={`flex items-center gap-2 text-sm ${
              check.passed
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <span aria-hidden="true">{check.passed ? "✓" : "○"}</span>
            {check.label}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 p-4 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Strength
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">
              {result.label}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 dark:text-slate-400">Estimated entropy</p>
            <p className="font-mono text-sm text-slate-900 dark:text-white">
              {password.length === 0 ? "—" : `${result.entropy} bits`}
            </p>
          </div>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
          <div
            className={`h-full rounded-full transition-all ${strengthTone}`}
            style={{ width: strengthWidth }}
          />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Score: {result.score}/5. Analysis runs entirely in your browser — the password is
          never sent anywhere.
        </p>
      </div>
    </div>
  );
}
