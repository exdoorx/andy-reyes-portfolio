import { useState } from "react";
import { demoInput, demoLabel, demoPrimary } from "./demoStyles";

const services = ["General check-up", "Dental cleaning", "Eye exam", "Consultation"];
const slots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

const today = (() => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
})();

const isTaken = (date, index) => {
  let hash = 0;
  for (const character of date) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return (hash + index * 7) % 4 === 0;
};

export default function AppointmentDemo() {
  const [service, setService] = useState(services[0]);
  const [date, setDate] = useState(today);
  const [slot, setSlot] = useState("");
  const [name, setName] = useState("");
  const [done, setDone] = useState(null);

  if (done) {
    return (
      <div className="rounded-2xl border border-sky-500/20 bg-sky-500/[0.06] p-6 text-center">
        <p className="text-5xl" aria-hidden="true">
          📅
        </p>
        <h4 className="mt-3 font-display text-xl font-semibold text-slate-950 dark:text-white">
          Appointment confirmed
        </h4>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {done.name} · {done.service}
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
          {done.date} at {done.slot}
        </p>
        <button
          type="button"
          onClick={() => {
            setDone(null);
            setSlot("");
            setName("");
          }}
          className={`${demoPrimary} mt-5`}
        >
          Book another appointment
        </button>
        <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
          Demonstration only — no appointment was saved.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setDone({ name, service, date, slot });
      }}
    >
      <div>
        <label htmlFor="appointment-service" className={demoLabel}>
          Service
        </label>
        <select
          id="appointment-service"
          value={service}
          onChange={(event) => setService(event.target.value)}
          className={demoInput}
        >
          {services.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="appointment-date" className={demoLabel}>
          Date
        </label>
        <input
          id="appointment-date"
          type="date"
          min={today}
          value={date}
          onChange={(event) => {
            setDate(event.target.value);
            setSlot("");
          }}
          className={demoInput}
          required
        />
      </div>

      <fieldset>
        <legend className={demoLabel}>Available time</legend>
        <div className="grid grid-cols-3 gap-2">
          {slots.map((time, index) => {
            const taken = isTaken(date, index);
            return (
              <button
                key={time}
                type="button"
                disabled={taken}
                onClick={() => setSlot(time)}
                aria-pressed={slot === time}
                className={`rounded-xl px-2 py-2 text-xs font-medium transition ${
                  taken
                    ? "cursor-not-allowed bg-slate-100 text-slate-400 line-through dark:bg-white/5 dark:text-slate-500"
                    : slot === time
                      ? "bg-brand-600 text-white dark:bg-brand-500"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          Unavailable slots are simulated to show the booking rule.
        </p>
      </fieldset>

      <div>
        <label htmlFor="appointment-name" className={demoLabel}>
          Your name
        </label>
        <input
          id="appointment-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={demoInput}
          placeholder="Juan Dela Cruz"
          autoComplete="name"
          required
        />
      </div>

      <button type="submit" disabled={!slot || !name.trim() || !date} className={demoPrimary}>
        Confirm appointment
      </button>
    </form>
  );
}
