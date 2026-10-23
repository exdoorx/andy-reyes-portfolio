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
          Interactive conceptual prototype. Full system integration available in source repositories.
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
      <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/5">
        <label className={label}>Your age: {age}</label>
        <input type="range" min="18" max="70" value={age} onChange={(e) => setAge(+e.target.value)} className="w-full accent-indigo-500" />
      </div>
      <div>
        <label className={label}>Select Plan</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.keys(plans).map((p) => (
            <button
              key={p}
              onClick={() => setPlan(p)}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                plan === p
                  ? "bg-linear-to-r from-brand-500 to-accent-500 text-white shadow-md"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-white/10 dark:text-slate-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500 italic">{plans[plan].perks}</p>
      </div>
      <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/5">
        <label className={label}>Coverage: {peso(coverage)}</label>
        <input type="range" min="100000" max="2000000" step="50000" value={coverage} onChange={(e) => setCoverage(+e.target.value)} className="w-full accent-cyan-500" />
      </div>
      <div className="rounded-2xl bg-linear-to-br from-brand-500/20 to-accent-400/20 p-6 text-center border border-brand-500/20">
        <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Estimated Monthly Premium</div>
        <div className="gradient-text font-display text-5xl font-bold my-1">{peso(monthly)}</div>
        <div className="text-[10px] text-slate-400 uppercase">Calculated via Actuarial Sample Logic</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   2. Math solver demo
------------------------------------------------------------------- */
function makeEvaluator(src) {
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
        <button className="shrink-0 rounded-xl bg-linear-to-r from-brand-500 to-accent-500 px-5 text-sm font-semibold text-white">Solve</button>
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
        <div className="rounded-2xl bg-linear-to-br from-emerald-400/15 to-cyan-400/15 p-5 border border-emerald-400/20">
          <ol className="mb-3 list-decimal space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {out.steps.map((s) => <li key={s}>{s}</li>)}
          </ol>
          <div className="gradient-text font-display text-4xl font-bold">{out.answer}</div>
        </div>
      )}
    </div>
  );
}

export function SoundsDemo() {
  const [scanning, setScanning] = useState(false);
  const [detected, setDetected] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [notes, setNotes] = useState(null);
  const fileInputRef = useRef(null);

  const startScanner = () => {
    setScanning(true);
    setDetected(null);
    setNotes(null);

    setTimeout(() => {
      const insts = [
        { name: "Kulintang", sound: "Metallic melodic gong", icon: "🔔", sample: "https://cdn.pixabay.com/audio/2022/03/15/audio_5fbc823006ca96687d0f6e974293888b.mp3", description: "Traditional gong ensemble from the Southern Philippines.", scale: "Slendro-like pentatonic" },
        { name: "Kubing", sound: "Rhythmic jaw harp", icon: "🎋", sample: "https://cdn.pixabay.com/audio/2022/03/10/audio_c336758694.mp3", description: "Bamboo jaw harp used in various Philippine ethnic groups.", scale: "Harmonic overtones" },
        { name: "Kudyapi", sound: "Two-stringed lute", icon: "🪕", sample: "https://cdn.pixabay.com/audio/2023/05/22/audio_7f6e8e4b5a.mp3", description: "Boat-shaped lute found in Mindanao.", scale: "Dorian-like mode" },
        { name: "Tongali", sound: "Bamboo nose flute", icon: "🌬️", sample: "https://cdn.pixabay.com/audio/2022/03/10/audio_7b3e5c1a2d.mp3", description: "Nose flute from the Kalinga people in the Cordillera region.", scale: "Pentatonic scale" },
      ];
      const isRecognized = Math.random() > 0.2;
      if (isRecognized) {
        setDetected(insts[Math.floor(Math.random() * insts.length)]);
      } else {
        setDetected({ name: "Unknown Instrument", sound: "Unrecognized", icon: "❓", description: "AI could not match this instrument to the current database.", isUnknown: true });
      }
      setScanning(false);
    }, 3000);
  };

  const generateNotes = () => {
    setGenerating(true);
    setTimeout(() => {
      const accompaniment = ["Guitar", "Drums", "Piano"][Math.floor(Math.random() * 3)];
      setNotes({
        scale: detected.scale || "Chromatic",
        chord: ["Am", "G", "C", "F"][Math.floor(Math.random() * 4)],
        accompaniment: accompaniment,
        notation: "♩ ♫ ♭ ♯ ♮ ♮ ♩"
      });
      setGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center dark:border-white/10 dark:bg-white/[0.02]">
        {scanning ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="relative w-48 h-32 bg-slate-200 rounded-lg overflow-hidden dark:bg-white/10">
              <div className="absolute inset-0 bg-slate-300 animate-pulse" />
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-500 shadow-[0_0_15px_rgba(var(--brand-rgb),1)] animate-scan" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl animate-bounce">🔍</span>
              </div>
            </div>
            <span className="text-sm font-medium text-brand-500 animate-pulse">
              AI Scanner Active: Analyzing Frequency & Geometry...
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="text-4xl mb-2">📷</div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Ready to identify traditional instruments
            </span>
            <button
              onClick={startScanner}
              className="rounded-full bg-brand-500 px-6 py-2 text-xs font-bold text-white shadow-md hover:scale-105 transition active:scale-95"
            >
              Start AI Scanner
            </button>
          </div>
        )}
      </div>
      {detected && (
        <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4">
          <div className={`rounded-2xl p-4 border flex items-center gap-4 ${detected.isUnknown ? "bg-red-500/10 border-red-500/20" : "bg-linear-to-br from-fuchsia-500/10 to-orange-400/10 border-fuchsia-500/20"}`}>
            <span className="text-4xl">{detected.icon}</span>
            <div className="flex-1">
              <div className="font-bold text-slate-900 dark:text-white">{detected.name}</div>
              <div className="text-xs text-slate-500">{detected.sound}</div>
              <div className="text-[10px] text-brand-500 font-medium mt-1">{detected.description}</div>
            </div>
            {!detected.isUnknown && (
              <button
                onClick={() => {
                  const audio = new Audio(detected.sample);
                  audio.play();
                }}
                className="rounded-full bg-fuchsia-500 p-2 text-white shadow-lg transition hover:scale-110"
              >
                ▶️
              </button>
            )}
          </div>

          {detected.isUnknown ? (
            <div className="rounded-2xl bg-slate-100 p-5 text-center dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                This instrument is not in our digital archive. For authentic identification, we recommend visiting:
              </p>
              <a
                href="https://nationalmuseum.gov.ph"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-brand-500 hover:underline"
              >
                National Museum of Music and Arts 🏛️
              </a>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">AI Composition Sheet</span>
                <button
                  onClick={generateNotes}
                  disabled={generating}
                  className="text-[10px] font-bold text-brand-500 hover:underline disabled:opacity-50"
                >
                  {generating ? "Analyzing Harmony..." : "Generate Sheet Music 🎼"}
                </button>
              </div>
              {generating ? (
                <div className="aspect-video rounded-xl bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 dark:bg-white/5">
                  <span className="text-xs italic">Synthesizing melodic patterns...</span>
                </div>
              ) : notes ? (
                <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-xl dark:bg-white/5">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Scale/Mode</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{notes.scale}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Root Chord</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{notes.chord}</div>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-200 dark:border-white/10">
                    <div className="text-[10px] text-slate-400 uppercase">Recommended Accompaniment</div>
                    <div className="flex items-center gap-2 text-sm font-bold text-brand-500">
                      <span>{notes.accompaniment}</span>
                      <span className="text-xs font-normal text-slate-500"> (Syncopated 4/4)</span>
                    </div>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-200 dark:border-white/10">
                    <div className="text-[10px] text-slate-400 uppercase">Melodic Sample</div>
                    <div className="text-lg font-serif tracking-widest text-slate-700 dark:text-slate-300">{notes.notation}</div>
                  </div>
                </div>
              ) : (
                <div className="aspect-video rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10">
                  <span className="text-xs italic">No sheet music generated yet</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <p className="text-xs text-slate-500 text-center">
        Simulated AI Recognition. In production, this uses a TensorFlow.js model trained on Southeast Asian instruments.
      </p>
    </div>
  );
}

export const demoTitles = {
  insurance: "Enterprise Insurance Portal · Sample Quote",
  math: "Advanced Math Solver · Sample Demo",
  sounds: "Ethno-Acoustic Library · Audio Analysis",
  order: "Full-Stack Food Ordering · Nutrition Scan",
  appointment: "Healthcare Booking Engine · Demo",
  calorie: "Nutritional Analysis Tool · Demo",
  subnet: "Network Subnet Architect · Demo",
  password: "Cyber-Security Password Auditor · Demo",
  planner: "Academic Task Orchestrator · Demo",
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
