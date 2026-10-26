import { useState, useEffect } from "react";
import { demoGhost } from "./demoStyles";

const BUGS = [
  { code: "const x = 10", fix: "const x = 10;" },
  { code: "if (x = 5)", fix: "if (x === 5)" },
  { code: "functin log() {}", fix: "function log() {}" },
  { code: "console.log(x", fix: "console.log(x)" },
];

export default function BugHuntDemo() {
  const [bug, setBug] = useState(BUGS[0]);
  const [fixed, setFixed] = useState(false);

  const nextBug = () => {
    setBug(BUGS[Math.floor(Math.random() * BUGS.length)]);
    setFixed(false);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Click the bug in the code to fix it!
      </p>
      <div className="rounded-xl bg-slate-950 p-4 font-mono text-emerald-400">
        <p>{fixed ? bug.fix : bug.code}</p>
      </div>
      {!fixed && (
        <button onClick={() => setFixed(true)} className={demoGhost}>
          Fix it
        </button>
      )}
      {fixed && (
        <div className="text-emerald-500 font-bold">
          Bug squashed! 🐛
          <button onClick={nextBug} className="ml-4 text-slate-400 underline">Next</button>
        </div>
      )}
    </div>
  );
}
