import { useEffect, useRef, useState } from "react";
import {
  OrderDemo, AppointmentDemo, CalorieDemo, SubnetDemo, PasswordDemo, PlannerDemo,
} from "./MoreDemos";

/* ------------------------------------------------------------------
   Modal wrapper
------------------------------------------------------------------- */
export function DemoModal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-white p-6 shadow-2xl dark:bg-[#10172e]"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close demo"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-700 hover:scale-110 dark:bg-white/10 dark:text-white"
          >
            ✕
          </button>
        </div>
        {children}
        <p className="mt-5 text-xs text-slate-500">
          Sample demo built for this portfolio. It shows the idea of the project, not the full app.
        </p>
      </div>
    </div>
  );
}

const input =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-white/10 dark:bg-white/5 dark:text-white";
const label = "mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500";

/* ------------------------------------------------------------------
   1. Insurance quote demo
------------------------------------------------------------------- */
const plans = {
  Basic: { mult: 1, perks: "Hospitalization & emergency cover" },
  Standard: { mult: 1.45, perks: "Basic + outpatient and medicines" },
  Premium: { mult: 1.9, perks: "Standard + critical illness and accident cover" },
};

export function InsuranceDemo() {
  const [age, setAge] = useState(26);
  const [plan, setPlan] = useState("Standard");
  const [coverage, setCoverage] = useState(500000);

  const ageFactor = age < 30 ? 1 : age < 45 ? 1.35 : age < 60 ? 1.9 : 2.6;
  const monthly = Math.round((coverage / 1000) * 0.9 * ageFactor * plans[plan].mult);
  const peso = (n) => "₱" + n.toLocaleString("en-PH");

  return (
    <div className="space-y-4">
      <div>
        <label className={label}>Your age: {age}</label>
        <input type="range" min="18" max="70" value={age} onChange={(e) => setAge(+e.target.value)} className="w-full accent-indigo-500" />
      </div>
      <div>
        <label className={label}>Plan</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.keys(plans).map((p) => (
            <button
              key={p}
              onClick={() => setPlan(p)}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                plan === p
                  ? "bg-gradient-to-r from-brand-500 to-accent-500 text-white"
                  : "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">{plans[plan].perks}</p>
      </div>
      <div>
        <label className={label}>Coverage: {peso(coverage)}</label>
        <input type="range" min="100000" max="2000000" step="50000" value={coverage} onChange={(e) => setCoverage(+e.target.value)} className="w-full accent-cyan-500" />
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-brand-500/15 to-accent-400/15 p-5 text-center">
        <div className="text-xs uppercase tracking-wider text-slate-500">Sample monthly premium</div>
        <div className="gradient-text font-display text-4xl font-bold">{peso(monthly)}</div>
        <div className="text-xs text-slate-500">Sample numbers only, not a real insurance quote.</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   2. Math solver demo (safe parser, no eval)
------------------------------------------------------------------- */
function makeEvaluator(src) {
  // Tokenize, inserting implicit multiplication (2x, 3(x+1), (x)(x))
  const raw = src.replace(/\s+/g, "").replace(/×/g, "*").replace(/÷/g, "/").toLowerCase();
  const tokens = [];
  for (let i = 0; i < raw.length; ) {
    const c = raw[i];
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < raw.length && /[0-9.]/.test(raw[j])) j++;
      const n = parseFloat(raw.slice(i, j));
      if (Number.isNaN(n)) throw new Error("Bad number");
      tokens.push({ t: "num", v: n });
      i = j;
    } else if (c === "x") {
      tokens.push({ t: "x" });
      i++;
    } else if ("+-*/^()".includes(c)) {
      tokens.push({ t: c });
      i++;
    } else {
      throw new Error(`I don't understand "${c}"`);
    }
  }
  const withMul = [];
  tokens.forEach((tok, idx) => {
    const prev = withMul[withMul.length - 1];
    const startsValue = tok.t === "num" || tok.t === "x" || tok.t === "(";
    const prevEndsValue = prev && (prev.t === "num" || prev.t === "x" || prev.t === ")");
    if (startsValue && prevEndsValue) withMul.push({ t: "*" });
    withMul.push(tok);
  });

  return (xVal) => {
    let p = 0;
    const peek = () => withMul[p]?.t;
    const eat = () => withMul[p++];
    function expr() {
      let v = term();
      while (peek() === "+" || peek() === "-") v = eat().t === "+" ? v + term() : v - term();
      return v;
    }
    function term() {
      let v = power();
      while (peek() === "*" || peek() === "/") {
        const op = eat().t;
        const r = power();
        if (op === "/" && r === 0) throw new Error("Can't divide by zero");
        v = op === "*" ? v * r : v / r;
      }
      return v;
    }
    function power() {
      const base = unary();
      if (peek() === "^") {
        eat();
        return Math.pow(base, power());
      }
      return base;
    }
    function unary() {
      if (peek() === "-") {
        eat();
        return -unary();
      }
      if (peek() === "+") {
        eat();
        return unary();
      }
      return atom();
    }
    function atom() {
      const tok = eat();
      if (!tok) throw new Error("The expression ended too early");
      if (tok.t === "num") return tok.v;
      if (tok.t === "x") return xVal;
      if (tok.t === "(") {
        const v = expr();
        if (eat()?.t !== ")") throw new Error("Missing closing )");
        return v;
      }
      throw new Error("Unexpected symbol");
    }
    const result = expr();
    if (p < withMul.length) throw new Error("Unexpected symbol");
    return result;
  };
}

const fmt = (n) => (Number.isInteger(n) ? String(n) : String(+n.toFixed(6)));

function solve(text) {
  const src = text.trim();
  if (!src) throw new Error("Type a problem first");
  const parts = src.split("=");
  if (parts.length > 2) throw new Error("Use only one = sign");

  if (parts.length === 1) {
    if (/x/i.test(src)) throw new Error("Add an = sign to solve for x, e.g. 2x + 3 = 11");
    const value = makeEvaluator(src)(0);
    if (!Number.isFinite(value)) throw new Error("That result is not a number");
    return { steps: [`Evaluate ${src}`], answer: fmt(value) };
  }

  const left = makeEvaluator(parts[0]);
  const right = makeEvaluator(parts[1]);
  const f = (x) => left(x) - right(x);
  const b = f(0);
  const a = f(1) - b;
  if (Math.abs(f(2) - (2 * a + b)) > 1e-9) throw new Error("This demo solves linear equations only (like 3x - 5 = 10)");
  if (Math.abs(a) < 1e-12) throw new Error(Math.abs(b) < 1e-12 ? "Every x works (infinite solutions)" : "No solution");
  const x = -b / a;
  return {
    steps: [
      `Move everything to one side: ${fmt(a)}x ${b < 0 ? "-" : "+"} ${fmt(Math.abs(b))} = 0`,
      `Move the number: ${fmt(a)}x = ${fmt(-b)}`,
      `Divide both sides by ${fmt(a)}`,
    ],
    answer: `x = ${fmt(x)}`,
  };
}

export function MathDemo() {
  const [text, setText] = useState("2x + 3 = 11");
  const [out, setOut] = useState(() => solve("2x + 3 = 11"));
  const [err, setErr] = useState("");

  const run = (e) => {
    e?.preventDefault();
    try {
      setOut(solve(text));
      setErr("");
    } catch (ex) {
      setErr(ex.message);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={run} className="flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} className={input} placeholder="Try 3(x - 2) = 12 or (4+6)*5" aria-label="Math problem" />
        <button className="shrink-0 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 px-5 text-sm font-semibold text-white">Solve</button>
      </form>
      <div className="flex flex-wrap gap-2">
        {["2x + 3 = 11", "3(x - 2) = 12", "5x - 4 = 2x + 8", "(4 + 6) * 5 - 2^3"].map((ex) => (
          <button key={ex} onClick={() => { setText(ex); try { setOut(solve(ex)); setErr(""); } catch (x) { setErr(x.message); } }} className="rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-700 dark:bg-white/10 dark:text-slate-300">
            {ex}
          </button>
        ))}
      </div>
      {err ? (
        <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-500">{err}</p>
      ) : (
        <div className="rounded-2xl bg-gradient-to-br from-emerald-400/15 to-cyan-400/15 p-5">
          <ol className="mb-3 list-decimal space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {out.steps.map((s) => <li key={s}>{s}</li>)}
          </ol>
          <div className="gradient-text font-display text-3xl font-bold">{out.answer}</div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
   3. Old instrument sounds demo (Web Audio, synthesized sample tones)
------------------------------------------------------------------- */
const instruments = {
  "Bamboo flute": { emoji: "🎋", type: "sine", decay: 1.4, partials: [1, 2], attack: 0.08 },
  "Lute": { emoji: "🪕", type: "triangle", decay: 1.0, partials: [1, 2, 3], attack: 0.005 },
  "Gong": { emoji: "🔔", type: "sine", decay: 3.0, partials: [1, 1.5, 2.76], attack: 0.01 },
  "Music box": { emoji: "🎼", type: "sine", decay: 1.6, partials: [1, 3, 5], attack: 0.003 },
};
// Pentatonic scale (C D E G A, then high C)
const notes = [
  ["C", 261.63], ["D", 293.66], ["E", 329.63], ["G", 392.0], ["A", 440.0], ["C²", 523.25],
];

export function SoundsDemo() {
  const [name, setName] = useState("Bamboo flute");
  const [active, setActive] = useState(null);
  const ctxRef = useRef(null);

  useEffect(() => () => ctxRef.current?.close?.(), []);

  const play = (freq, i) => {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    ctxRef.current = ctxRef.current || new Ctx();
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") ctx.resume();
    const inst = instruments[name];
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.35, now + inst.attack);
    master.gain.exponentialRampToValueAtTime(0.0001, now + inst.decay);
    master.connect(ctx.destination);
    inst.partials.forEach((mult, k) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = inst.type;
      osc.frequency.value = freq * mult * (name === "Gong" ? 0.5 : 1);
      g.gain.value = 1 / (k + 1);
      osc.connect(g).connect(master);
      osc.start(now);
      osc.stop(now + inst.decay + 0.05);
    });
    setActive(i);
    setTimeout(() => setActive(null), 180);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(instruments).map(([n, v]) => (
          <button
            key={n}
            onClick={() => setName(n)}
            className={`rounded-xl px-3 py-3 text-sm font-medium transition ${
              name === n
                ? "bg-gradient-to-r from-fuchsia-500 to-orange-400 text-white"
                : "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-200"
            }`}
          >
            <span className="mr-1">{v.emoji}</span>
            {n}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-6 gap-2">
        {notes.map(([n, f], i) => (
          <button
            key={n}
            onClick={() => play(f, i)}
            className={`h-24 rounded-xl border border-slate-300 text-sm font-semibold transition dark:border-white/10 ${
              active === i
                ? "scale-95 bg-orange-400 text-white"
                : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-500">
        Tap the keys to play. These are tones generated in your browser to imitate the idea. The real app
        uses actual instrument sounds.
      </p>
    </div>
  );
}

export const demoTitles = {
  insurance: "Insurance Website · Sample Quote",
  math: "Math Solver · Sample Demo",
  sounds: "Old Instrument Sounds · Sample Demo",
  order: "Food Ordering App · Sample Demo",
  appointment: "Appointment Booking · Sample Demo",
  calorie: "Calorie & Protein Calculator",
  subnet: "Subnet Calculator",
  password: "Password Strength Checker",
  planner: "Study Planner · Sample Demo",
};

const demoMap = {
  insurance: InsuranceDemo,
  math: MathDemo,
  sounds: SoundsDemo,
  order: OrderDemo,
  appointment: AppointmentDemo,
  calorie: CalorieDemo,
  subnet: SubnetDemo,
  password: PasswordDemo,
  planner: PlannerDemo,
};

export function DemoBody({ id }) {
  const Demo = demoMap[id];
  return Demo ? <Demo /> : null;
}
