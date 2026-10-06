import { useMemo, useState } from "react";

const input =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-white/10 dark:bg-white/5 dark:text-white";
const label = "mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500";
const primaryBtn =
  "w-full rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100";
const peso = (n) => "₱" + n.toLocaleString("en-PH");

/* ------------------------------------------------------------------
   Food ordering
------------------------------------------------------------------- */
const menu = [
  { id: 1, name: "Chicken Adobo Rice", price: 120, emoji: "🍛" },
  { id: 2, name: "Pork Sinigang", price: 150, emoji: "🍲" },
  { id: 3, name: "Pancit Canton", price: 95, emoji: "🍜" },
  { id: 4, name: "Halo-halo", price: 85, emoji: "🍧" },
  { id: 5, name: "Iced Tea", price: 45, emoji: "🧋" },
];

export function OrderDemo() {
  const [cart, setCart] = useState({});
  const [placed, setPlaced] = useState(null);

  const change = (id, d) =>
    setCart((c) => {
      const q = Math.max(0, (c[id] || 0) + d);
      const next = { ...c, [id]: q };
      if (!q) delete next[id];
      return next;
    });
  const items = menu.filter((m) => cart[m.id]);
  const total = items.reduce((s, m) => s + m.price * cart[m.id], 0);
  const count = items.reduce((s, m) => s + cart[m.id], 0);

  if (placed)
    return (
      <div className="space-y-3 rounded-2xl bg-gradient-to-br from-emerald-400/15 to-cyan-400/15 p-6 text-center">
        <div className="text-5xl">✅</div>
        <h4 className="font-display text-xl font-semibold text-slate-900 dark:text-white">Order placed!</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Order <b>{placed.no}</b> · {placed.count} item(s) · {peso(placed.total)}
        </p>
        <button onClick={() => { setPlaced(null); setCart({}); }} className={primaryBtn}>Order again</button>
      </div>
    );

  return (
    <div className="space-y-3">
      {menu.map((m) => (
        <div key={m.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/50 p-3 dark:border-white/10 dark:bg-white/5">
          <span className="text-3xl">{m.emoji}</span>
          <div className="flex-1">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">{m.name}</div>
            <div className="text-xs text-slate-500">{peso(m.price)}</div>
          </div>
          <div className="flex items-center gap-2">
            <button aria-label={`Remove ${m.name}`} onClick={() => change(m.id, -1)} className="h-8 w-8 rounded-full bg-slate-200 font-bold text-slate-700 dark:bg-white/10 dark:text-white">−</button>
            <span className="w-5 text-center text-sm text-slate-900 dark:text-white">{cart[m.id] || 0}</span>
            <button aria-label={`Add ${m.name}`} onClick={() => change(m.id, 1)} className="h-8 w-8 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 font-bold text-white">+</button>
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3 text-sm dark:bg-white/5">
        <span className="text-slate-600 dark:text-slate-400">{count} item(s)</span>
        <span className="font-display text-xl font-bold text-slate-900 dark:text-white">{peso(total)}</span>
      </div>
      <button
        disabled={!count}
        onClick={() => setPlaced({ no: "#" + Math.floor(1000 + Math.random() * 9000), count, total })}
        className={primaryBtn}
      >
        Place order
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------
   Appointment booking
------------------------------------------------------------------- */
const services = ["General check-up", "Dental cleaning", "Eye exam", "Consultation"];
const slots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

// deterministic "already booked" slots so the demo looks real
const isTaken = (date, i) => {
  let h = 0;
  for (const c of date) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return (h + i * 7) % 4 === 0;
};

export function AppointmentDemo() {
  const today = new Date().toISOString().slice(0, 10);
  const [service, setService] = useState(services[0]);
  const [date, setDate] = useState(today);
  const [slot, setSlot] = useState("");
  const [name, setName] = useState("");
  const [done, setDone] = useState(null);

  if (done)
    return (
      <div className="space-y-3 rounded-2xl bg-gradient-to-br from-sky-400/15 to-indigo-400/15 p-6 text-center">
        <div className="text-5xl">📅</div>
        <h4 className="font-display text-xl font-semibold text-slate-900 dark:text-white">You're booked, {done.name}!</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400">{done.service} · {done.date} at {done.slot}</p>
        <button onClick={() => { setDone(null); setSlot(""); }} className={primaryBtn}>Book another</button>
      </div>
    );

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => { e.preventDefault(); setDone({ name, service, date, slot }); }}
    >
      <div>
        <label className={label}>Service</label>
        <select value={service} onChange={(e) => setService(e.target.value)} className={input}>
          {services.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className={label}>Date</label>
        <input type="date" min={today} value={date} onChange={(e) => { setDate(e.target.value); setSlot(""); }} className={input} required />
      </div>
      <div>
        <label className={label}>Time</label>
        <div className="grid grid-cols-3 gap-2">
          {slots.map((s, i) => {
            const taken = isTaken(date, i);
            return (
              <button
                type="button"
                key={s}
                disabled={taken}
                onClick={() => setSlot(s)}
                className={`rounded-xl px-2 py-2 text-xs font-medium transition ${
                  taken
                    ? "cursor-not-allowed bg-slate-200/50 text-slate-400 line-through dark:bg-white/5"
                    : slot === s
                    ? "bg-gradient-to-r from-brand-500 to-accent-500 text-white"
                    : "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-200"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label className={label}>Your name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className={input} placeholder="Juan Dela Cruz" required />
      </div>
      <button disabled={!slot || !name || !date} className={primaryBtn}>Confirm appointment</button>
    </form>
  );
}

/* ------------------------------------------------------------------
   Calorie & protein calculator
------------------------------------------------------------------- */
const activity = [
  ["Sedentary (desk job)", 1.2],
  ["Light (1-3 workouts/week)", 1.375],
  ["Moderate (3-5 workouts/week)", 1.55],
  ["Very active (6-7 workouts/week)", 1.725],
];
const goals = {
  "Lose weight": { adj: 0.85, p: [1.6, 2.2] },
  "Maintain weight": { adj: 1, p: [1.2, 1.6] },
  "Build muscle": { adj: 1.1, p: [1.6, 2.2] },
};

export function CalorieDemo() {
  const [sex, setSex] = useState("male");
  const [age, setAge] = useState(26);
  const [kg, setKg] = useState(65);
  const [cm, setCm] = useState(168);
  const [act, setAct] = useState(1.375);
  const [goal, setGoal] = useState("Maintain weight");

  const r = useMemo(() => {
    const bmr = 10 * kg + 6.25 * cm - 5 * age + (sex === "male" ? 5 : -161);
    const kcal = Math.round(bmr * act * goals[goal].adj);
    const [lo, hi] = goals[goal].p;
    const pLo = Math.round(kg * lo);
    const pHi = Math.round(kg * hi);
    const protein = Math.round((pLo + pHi) / 2);
    const fat = Math.round((kcal * 0.25) / 9);
    const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
    return { kcal, pLo, pHi, protein, fat, carbs };
  }, [sex, age, kg, cm, act, goal]);

  const num = (set) => (e) => set(Math.max(0, +e.target.value));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label}>Sex</label>
          <select value={sex} onChange={(e) => setSex(e.target.value)} className={input}>
            <option value="male">Male</option><option value="female">Female</option>
          </select>
        </div>
        <div><label className={label}>Age</label><input type="number" value={age} onChange={num(setAge)} className={input} /></div>
        <div><label className={label}>Weight (kg)</label><input type="number" value={kg} onChange={num(setKg)} className={input} /></div>
        <div><label className={label}>Height (cm)</label><input type="number" value={cm} onChange={num(setCm)} className={input} /></div>
      </div>
      <div>
        <label className={label}>Activity</label>
        <select value={act} onChange={(e) => setAct(+e.target.value)} className={input}>
          {activity.map(([n, v]) => <option key={n} value={v}>{n}</option>)}
        </select>
      </div>
      <div>
        <label className={label}>Goal</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.keys(goals).map((g) => (
            <button key={g} type="button" onClick={() => setGoal(g)} className={`rounded-xl px-2 py-2 text-xs font-medium ${goal === g ? "bg-gradient-to-r from-lime-400 to-emerald-500 text-white" : "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-200"}`}>{g}</button>
          ))}
        </div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-lime-400/15 to-emerald-500/15 p-5 text-center">
        <div className="text-xs uppercase tracking-wider text-slate-500">Daily target</div>
        <div className="gradient-text font-display text-4xl font-bold">{r.kcal.toLocaleString()} kcal</div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
          <div className="rounded-xl bg-white/60 p-2 dark:bg-white/5"><b className="block text-slate-900 dark:text-white">{r.protein} g</b>Protein</div>
          <div className="rounded-xl bg-white/60 p-2 dark:bg-white/5"><b className="block text-slate-900 dark:text-white">{r.carbs} g</b>Carbs</div>
          <div className="rounded-xl bg-white/60 p-2 dark:bg-white/5"><b className="block text-slate-900 dark:text-white">{r.fat} g</b>Fat</div>
        </div>
        <p className="mt-3 text-xs text-slate-500">Protein range: {r.pLo}–{r.pHi} g/day. General estimate only (Mifflin-St Jeor), not medical advice.</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Subnet calculator
------------------------------------------------------------------- */
const toIp = (n) => [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");

function subnet(text) {
  const m = text.trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/);
  if (!m) throw new Error("Use the format 192.168.1.10/24");
  const octets = m.slice(1, 5).map(Number);
  const bits = Number(m[5]);
  if (octets.some((o) => o > 255)) throw new Error("Each number must be 0-255");
  if (bits > 32) throw new Error("The prefix must be 0-32");
  const ip = ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  const network = (ip & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const total = 2 ** (32 - bits);
  let hosts, first, last;
  if (bits === 32) { hosts = 1; first = last = network; }
  else if (bits === 31) { hosts = 2; first = network; last = broadcast; }
  else { hosts = total - 2; first = network + 1; last = broadcast - 1; }
  return [
    ["Network", toIp(network)],
    ["Subnet mask", toIp(mask)],
    ["Broadcast", toIp(broadcast)],
    ["First host", toIp(first >>> 0)],
    ["Last host", toIp(last >>> 0)],
    ["Usable hosts", hosts.toLocaleString()],
  ];
}

export function SubnetDemo() {
  const [text, setText] = useState("192.168.1.10/24");
  let rows = null, err = "";
  try { rows = subnet(text); } catch (e) { err = e.message; }
  return (
    <div className="space-y-4">
      <div>
        <label className={label}>IPv4 address / prefix</label>
        <input value={text} onChange={(e) => setText(e.target.value)} className={input} placeholder="10.0.0.5/16" />
      </div>
      <div className="flex flex-wrap gap-2">
        {["192.168.1.10/24", "10.0.0.5/16", "172.16.8.77/26"].map((x) => (
          <button key={x} onClick={() => setText(x)} className="rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-700 dark:bg-white/10 dark:text-slate-300">{x}</button>
        ))}
      </div>
      {err ? (
        <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-500">{err}</p>
      ) : (
        <dl className="divide-y divide-slate-200 rounded-2xl bg-gradient-to-br from-cyan-400/10 to-blue-600/10 px-4 dark:divide-white/10">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between py-2.5 text-sm">
              <dt className="text-slate-500">{k}</dt>
              <dd className="font-mono font-semibold text-slate-900 dark:text-white">{v}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
   Password strength checker (runs only in the browser)
------------------------------------------------------------------- */
function assess(pw) {
  const checks = [
    ["At least 12 characters", pw.length >= 12],
    ["Lowercase letters", /[a-z]/.test(pw)],
    ["Uppercase letters", /[A-Z]/.test(pw)],
    ["Numbers", /\d/.test(pw)],
    ["Symbols (!@#$...)", /[^A-Za-z0-9]/.test(pw)],
  ];
  const pool =
    (/[a-z]/.test(pw) ? 26 : 0) + (/[A-Z]/.test(pw) ? 26 : 0) + (/\d/.test(pw) ? 10 : 0) + (/[^A-Za-z0-9]/.test(pw) ? 32 : 0);
  let bits = pw.length && pool ? pw.length * Math.log2(pool) : 0;
  const common = /(password|qwerty|12345|letmein|admin|iloveyou)/i.test(pw);
  const repeated = /(.)\1{2,}/.test(pw);
  if (common) bits = Math.min(bits, 20);
  if (repeated) bits *= 0.8;
  const level = bits < 28 ? 0 : bits < 45 ? 1 : bits < 60 ? 2 : bits < 80 ? 3 : 4;
  return { checks, bits: Math.round(bits), level, common, repeated };
}
const levels = [
  ["Very weak", "bg-red-500"],
  ["Weak", "bg-orange-500"],
  ["Okay", "bg-yellow-500"],
  ["Strong", "bg-lime-500"],
  ["Very strong", "bg-emerald-500"],
];

export function PasswordDemo() {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const a = assess(pw);
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input type={show ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} className={input} placeholder="Type a password to test" autoComplete="off" spellCheck={false} />
        <button type="button" onClick={() => setShow(!show)} className="shrink-0 rounded-xl bg-slate-200 px-3 text-sm text-slate-700 dark:bg-white/10 dark:text-slate-200">{show ? "Hide" : "Show"}</button>
      </div>
      <div>
        <div className="flex h-2.5 gap-1">
          {levels.map(([, c], i) => (
            <div key={i} className={`flex-1 rounded-full ${pw && i <= a.level ? c : "bg-slate-200 dark:bg-white/10"}`} />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="font-semibold text-slate-900 dark:text-white">{pw ? levels[a.level][0] : "Waiting for input"}</span>
          <span className="text-slate-500">~{a.bits} bits of entropy</span>
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-2 text-xs">
        {a.checks.map(([n, ok]) => (
          <li key={n} className={ok ? "text-emerald-500" : "text-slate-500"}>{ok ? "✓" : "○"} {n}</li>
        ))}
      </ul>
      {pw && a.common && <p className="rounded-xl bg-orange-500/10 p-3 text-xs text-orange-500">Contains a very common word or pattern. Attackers try these first.</p>}
      {pw && a.repeated && <p className="rounded-xl bg-orange-500/10 p-3 text-xs text-orange-500">Repeated characters make a password easier to guess.</p>}
      <p className="text-xs text-slate-500">🔒 Checked locally in your browser. Nothing is stored or sent. Tip: a long passphrase plus a password manager and 2FA beats a short complex password.</p>
    </div>
  );
}

/* ------------------------------------------------------------------
   Study planner
------------------------------------------------------------------- */
const prio = { High: "text-red-500 bg-red-500/10", Medium: "text-yellow-500 bg-yellow-500/10", Low: "text-emerald-500 bg-emerald-500/10" };

export function PlannerDemo() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Review networking notes", p: "High", done: false },
    { id: 2, title: "Finish SQL practice set", p: "Medium", done: true },
    { id: 3, title: "Read cloud basics chapter", p: "Low", done: false },
  ]);
  const [title, setTitle] = useState("");
  const [p, setP] = useState("Medium");
  const done = tasks.filter((t) => t.done).length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  const add = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setTasks([...tasks, { id: Date.now(), title: title.trim(), p, done: false }]);
    setTitle("");
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 flex justify-between text-xs text-slate-500"><span>Progress</span><span>{done}/{tasks.length} · {pct}%</span></div>
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <form onSubmit={add} className="flex gap-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={input} placeholder="Add a task" aria-label="Task title" />
        <select value={p} onChange={(e) => setP(e.target.value)} className={`${input} !w-28`} aria-label="Priority">
          {Object.keys(prio).map((x) => <option key={x}>{x}</option>)}
        </select>
        <button className="shrink-0 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 text-sm font-semibold text-white">Add</button>
      </form>
      <ul className="space-y-2">
        {tasks.map((t) => (
          <li key={t.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/50 px-3 py-2.5 dark:border-white/10 dark:bg-white/5">
            <input type="checkbox" checked={t.done} onChange={() => setTasks(tasks.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))} className="h-4 w-4 accent-orange-500" aria-label={`Done: ${t.title}`} />
            <span className={`flex-1 text-sm ${t.done ? "text-slate-400 line-through" : "text-slate-800 dark:text-slate-200"}`}>{t.title}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${prio[t.p]}`}>{t.p}</span>
            <button onClick={() => setTasks(tasks.filter((x) => x.id !== t.id))} aria-label={`Delete ${t.title}`} className="text-slate-400 hover:text-red-500">✕</button>
          </li>
        ))}
        {!tasks.length && <li className="text-center text-sm text-slate-500">No tasks yet. Add one above.</li>}
      </ul>
    </div>
  );
}
