import { useState } from "react";
import { solveExpression } from "../../lib/mathSolver";
import { demoInput } from "./demoStyles";

const examples = ["2x + 3 = 11", "3(x - 2) = 12", "5x - 4 = 2x + 8", "(4 + 6) * 5 - 2^3"];

export default function MathDemo() {
  const [text, setText] = useState("2x + 3 = 11");
  const [result, setResult] = useState(() => solveExpression("2x + 3 = 11"));
  const [error, setError] = useState("");

  const solve = (value) => {
    try {
      setResult(solveExpression(value));
      setError("");
    } catch (caught) {
      setError(caught.message);
    }
  };

  const submit = (event) => {
    event.preventDefault();
    solve(text);
  };

  const chooseExample = (example) => {
    setText(example);
    solve(example);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="math-expression" className="sr-only">
          Math expression or equation
        </label>
        <input
          id="math-expression"
          value={text}
          onChange={(event) => setText(event.target.value)}
          className={demoInput}
          placeholder="Try 3(x - 2) = 12"
          autoComplete="off"
        />
        <button
          type="submit"
          className="btn btn-primary shrink-0 px-6"
        >
          Solve
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => chooseExample(example)}
            className="chip transition hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400"
          >
            {example}
          </button>
        ))}
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      ) : (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-5" aria-live="polite">
          <ol className="list-decimal space-y-1.5 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {result.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="gradient-text mt-4 font-display text-4xl font-semibold">
            {result.answer}
          </p>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        Supports +, −, ×, ÷, powers, parentheses, implicit multiplication, and one variable
        (x). Linear equations only.
      </p>
    </div>
  );
}
