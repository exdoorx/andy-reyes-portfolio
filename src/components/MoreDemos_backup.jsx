import { useMemo, useState, useRef } from "react";

const input =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-white/10 dark:bg-white/5 dark:text-white";
const label = "mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500";
const primaryBtn =
  "w-full rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100";
const peso = (n) => "₱" + n.toLocaleString("en-PH");

/* ------------------------------------------------------------------
   Combined AI Nutrition & Shopify-Style Shop
------------------------------------------------------------------- */
const menu = [
  { id: 1, name: "Chicken Adobo Rice", price: 120, emoji: "🍛", cal: 450, category: "Meals", img: "https://images.unsplash.com/photo-1546069901-ba95//" },
  { id: 2, name: "Pork Sinigang", price: 150, emoji: "🍲", cal: 320, category: "Meals", img: "https://images.unsplash.com/photo-1547592166-2ud372b5" },
  { id: 3, name: "Pancit Canton", price: 95, emoji: "🍜", cal: 380, category: "Meals", img: "https://images.unsplash.com/photo-1585032226651-759b66f14a9f" },
  { id: 4, name: "Halo-halo", price: 85, emoji: "🍧", cal: 250, category: "Dessert", img: "https://images.unsplash.com/photo-1563729784474-d77aC7bfeB6a" },
  { id: 5, name: "Iced Tea", price: 45, emoji: "🧋", cal: 120, category: "Drinks", img: "https://images.unsplash.com/photo-1556679343-67ca4858ed7c" },
];

export function OrderDemo() {
  const [view, setView] = useState("shop"); // "shop" | "scanner"
  const [cart, setCart] = useState({});
  const [placed, setPlaced] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scannedItem, setScannedItem] = useState(null);
  const fileInputRef = useRef(null);

  const change = (id, d) =>
    setCart((c) => {
      const q = Math.max(0, (c[id] || 0) + d);
      const next = { ...c, [id]: q };
      if (!q) delete next[id];
      return next;
    });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setScanning(true);
    setScannedItem(null);

    // Simulate AI Vision scanning delay
    setTimeout(() => {
      const randomItem = menu[Math.floor(Math.random() * menu.length)];
      setScannedItem(randomItem);
      setScanning(false);
    }, 2000);
  };

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
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-2xl">
        <button
          onClick={() => setView("shop")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${view === "shop" ? "bg-white dark:bg-white/10 shadow-sm text-brand-500" : "text-slate-500"}`}
        >
          🛍️ Store
        </button>
        <button
          onClick={() => setView("scanner")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${view === "scanner" ? "bg-white dark:bg-white/10 shadow-sm text-brand-500" : "text-slate-500"}`}
        >
          🥗 Calorie Scan
        </button>
      </div>

      {view === "scanner" ? (
        <div className="space-y-4">
          <div className="rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
            <label className="cursor-pointer">
              <div className="flex flex-col items-center gap-3">
                <span className="text-4xl animate-bounce">{scanning ? "🔍" : "📸"}</span>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {scanning ? "AI is analyzing nutrition..." : "Upload food photo to calculate calories"}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} ref={fileInputRef} />
                <button type="button" className="rounded-full bg-brand-500 px-6 py-2 text-xs font-bold text-white shadow-md hover:scale-105 transition">
                  Select Image
                </button>
              </div>
            </label>
          </div>

          {scannedItem && !scanning && (
            <div className="animate-in fade-in slide-in-from-bottom-4 rounded-3xl bg-white dark:bg-white/5 p-5 border-2 border-brand-500 shadow-xl flex items-center gap-4">
              <span className="text-5xl">{scannedItem.emoji}</span>
              <div className="flex-1">
                <div className="text-lg font-bold text-slate-900 dark:text-white">{scannedItem.name}</div>
                <div className="text-sm text-brand-500 font-semibold">Estimated {scannedItem.cal} kcal</div>
                <div className="text-[10px] text-slate-400 mt-1">Confidence Score: 98.2% (AI-Driven)</div>
              </div>
              <button
                onClick={() => { change(scannedItem.id, 1); setView("shop"); }}
                className="rounded-xl bg-brand-500 px-4 py-2 text-xs text-white font-bold hover:bg-brand-600 transition"
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Shopify-style Product Grid */}
          <div className="grid grid-cols-2 gap-4">
            {menu.map((m) => (
              <div key={m.id} className="group relative rounded-2xl border border-slate-200 bg-white p-3 transition hover:shadow-lg dark:border-white/10 dark:bg-white/5">
                <div className="aspect-square rounded-xl bg-slate-100 flex items-center justify-center text-5xl mb-3 group-hover:scale-105 transition dark:bg-white/5">
                  {m.emoji}
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{m.name}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-bold text-brand-500">{peso(m.price)}</span>
                    <span className="text-[10px] text-slate-400">{m.cal} kcal</span>
                  </div>
                </div>
                <button
                  onClick={() => change(m.id, 1)}
                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center text-brand-500 hover:bg-brand-500 hover:text-white transition dark:bg-slate-800"
                >
                  +
                </button>
              </div>
            ))}
          </div>

          {/* Floating Cart Summary */}
          {count > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50 animate-in slide-in-from-bottom-4">
              <div className="rounded-2xl bg-slate-900 p-4 text-white shadow-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-brand-500 rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">{count}</div>
                  <span className="text-sm font-medium">Your Order</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold">{peso(total)}</span>
                  <button
                    onClick={() => setPlaced({ no: "#" + Math.floor(1000 + Math.random() * 9000), count, total })}
                    className="rounded-lg bg-brand-500 px-4 py-1.5 text-xs font-bold hover:bg-brand-600 transition"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
   Appointment booking
------------------------------------------------------------------- */
const services = ["General check-up", "Dental cleaning", "Eye exam", "Consultation"];
const slots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];
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

export function SubnetDemo() {
  const toIp = (n) => [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
  const [text, setText] = useState("192.168.1.10/24");
  let rows = null, err = "";
  try {
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
    rows = [
      ["Network", toIp(network)],
      ["Subnet mask", toIp(mask)],
      ["Broadcast", toIp(broadcast)],
      ["First host", toIp(first >>> 0)],
      ["Last host", toIp(last >>> 0)],
      ["Usable hosts", hosts.toLocaleString()],
    ];
  } catch (e) { err = e.message; }
  return (
    <div className="space-y-4">
      <div>
        <label className={label}>IPv4 address / prefix</label>
        <input value={text} onChange={(e) => setText(e.target.value)} className={input} placeholder="192.168.1.1/24" />
      </div>
      {err ? (
        <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-500">{err}</p>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
          <table className="w-full text-sm text-left">
            <tbody>
              {rows.map(([k, v]) => (
                <tr key={k} className="border-b border-slate-100 last:border-0 dark:border-white/5">
                  <td className="py-2 font-medium text-slate-500">{k}</td>
                  <td className="py-2 text-slate-900 dark:text-white">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function PasswordDemo() {
  const [text, setText] = useState("");
  const check = (s) => {
    const res = { len: s.length >= 8, up: /[A-Z]/.test(s), lo: /[a-z]/.test(s), num: /[0-9]/.test(s), spc: /[^A-Za-z0-9]/.test(s) };
    const score = Object.values(res).filter(Boolean).length;
    return { ...res, score };
  };
  const r = check(text);
  return (
    <div className="space-y-4">
      <div>
        <label className={label}>Password</label>
        <input type="password" value={text} onChange={(e) => setText(e.target.value)} className={input} placeholder="Enter password..." />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          ["Length (8+)", r.len], ["Uppercase", r.up], ["Lowercase", r.lo], ["Number", r.num], ["Special", r.spc],
        ].map(([l, v]) => (
          <div key={l} className={`flex items-center gap-2 text-xs ${v ? "text-emerald-500" : "text-slate-400"}`}>
            <span>{v ? "✓" : "✕"}</span> {l}
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-slate-100 p-4 text-center dark:bg-white/5">
        <div className="text-xs uppercase text-slate-500 font-semibold">Strength Score</div>
        <div className={`text-3xl font-bold ${r.score < 3 ? "text-red-500" : r.score < 5 ? "text-amber-500" : "text-emerald-500"}`}>
          {r.score} / 5
        </div>
      </div>
    </div>
  );
}

export function PlannerDemo() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Finish Project Report", done: false, priority: "High" },
    { id: 2, text: "Review Literature", done: true, priority: "Medium" },
  ]);
  const [text, setText] = useState("");
  const [pri, setPri] = useState("Medium");
  const add = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setTasks([...tasks, { id: Date.now(), text, done: false, priority: pri }]);
    setText("");
  };
  const toggle = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  return (
    <div className="space-y-4">
      <form onSubmit={add} className="flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} className={input} placeholder="New task..." />
        <select value={pri} onChange={(e) => setPri(e.target.value)} className="rounded-xl bg-slate-100 px-2 text-xs dark:bg-white/10">
          <option>Low</option><option>Medium</option><option>High</option>
        </select>
        <button className="rounded-xl bg-brand-500 px-3 text-white text-xs font-bold">+</button>
      </form>
      <div className="space-y-2">
        {tasks.map((t) => (
          <div key={t.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-white/10">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500" />
              <span className={`text-sm ${t.done ? "text-slate-400 line-through" : "text-slate-900 dark:text-white"}`}>{t.text}</span>
            </div>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${t.priority === "High" ? "bg-red-100 text-red-600" : t.priority === "Medium" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"}`}>{t.priority}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
