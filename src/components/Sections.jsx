import { useState } from "react";
import Reveal, { SectionTitle } from "./Reveal";
import { profile, stats, skills, tools, projects, promptEngineering } from "../data";
import { DemoModal, DemoBody, demoTitles } from "./Demos";
import { supabaseReady, saveContactMessage } from "../lib/supabase";

export const Section = ({ id, children, className = "" }) => (
  <section id={id} className={`px-5 py-20 sm:py-24 ${className}`}>
    <div className="mx-auto max-w-6xl">{children}</div>
  </section>
);

export function About() {
  return (
    <Section id="about">
      <SectionTitle eyebrow="Get to know me" title="About Me" />
      <div className="grid items-center gap-10 md:grid-cols-2">
        <Reveal>
          <div className="space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
            {profile.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <ul className="grid grid-cols-2 gap-3 pt-2 text-sm">
              <li><b className="text-slate-900 dark:text-white">Name:</b> {profile.name}</li>
              <li><b className="text-slate-900 dark:text-white">Age:</b> {profile.age}</li>
              <li><b className="text-slate-900 dark:text-white">School:</b> {profile.school}</li>
              <li><b className="text-slate-900 dark:text-white">Course:</b> BSIT</li>
            </ul>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100}>
              <div className="glass rounded-2xl p-6 text-center transition hover:-translate-y-1">
                <div className="gradient-text font-display text-4xl font-bold">{s.value}</div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function Skills() {
  return (
    <Section id="skills" className="bg-slate-100/60 dark:bg-white/[0.02]">
      <SectionTitle eyebrow="What I can do" title="Skills & Tools" />
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          {skills.map((s, i) => (
            <Reveal key={s.name} delay={i * 70}>
              <div className="mb-2 flex justify-between text-sm font-medium text-slate-800 dark:text-slate-200">
                <span>{s.name}</span>
                <span className="text-slate-500">{s.level}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 via-accent-400 to-mint-400"
                  style={{ width: `${s.level}%` }}
                />
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="glass rounded-3xl p-8">
            <h3 className="mb-5 font-display text-lg font-semibold text-slate-900 dark:text-white">
              Tech toolbox
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {tools.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-brand-400/30 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-500 transition hover:scale-105 dark:text-brand-400"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Prompt engineering */}
      <Reveal className="mt-12">
        <div className="glass relative overflow-hidden rounded-3xl p-8">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-gradient-to-br from-fuchsia-500/30 to-orange-400/30 blur-3xl" />
          <div className="relative grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="rounded-full bg-fuchsia-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-fuchsia-500">
                Specialization
              </span>
              <h3 className="mt-3 font-display text-2xl font-bold text-slate-900 dark:text-white">
                {promptEngineering.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {promptEngineering.summary}
              </p>
              <ul className="mt-4 grid gap-2 text-sm text-slate-700 dark:text-slate-300 sm:grid-cols-2">
                {promptEngineering.abilities.map((a) => (
                  <li key={a} className="flex gap-2"><span className="text-mint-400">✓</span>{a}</li>
                ))}
              </ul>
            </div>
            <div className="grid content-center gap-3">
              {promptEngineering.specialties.map((s) => (
                <div key={s.name} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/50 px-5 py-4 transition hover:translate-x-1 dark:border-white/10 dark:bg-white/5">
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <div className="font-display font-semibold text-slate-900 dark:text-white">{s.name}</div>
                    <div className="text-xs text-slate-500">{s.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

export function Projects() {
  const [filter, setFilter] = useState("All");
  const [openDemo, setOpenDemo] = useState(null);
  const types = ["All", ...new Set(projects.map((p) => p.type))];
  const shown = projects.filter((p) => filter === "All" || p.type === filter);

  return (
    <Section id="projects">
      <SectionTitle eyebrow="Things I've built" title="Featured Projects" />
      <div className="mb-10 flex justify-center gap-2">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              filter === t
                ? "bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-500/30"
                : "glass text-slate-600 hover:scale-105 dark:text-slate-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => (
          <Reveal key={p.title} delay={i * 100}>
            <article className="glass group h-full overflow-hidden rounded-3xl transition hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-500/20">
              <div className={`flex h-40 items-center justify-center bg-gradient-to-br ${p.gradient}`}>
                <span className="text-6xl transition group-hover:scale-125">{p.emoji}</span>
              </div>
              <div className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white">{p.title}</h3>
                  <span className="rounded-full bg-accent-500/15 px-3 py-0.5 text-xs font-medium text-accent-500">{p.type}</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{p.description}</p>
                {p.badge && (
                  <span className="mt-3 inline-block rounded-full border border-dashed border-slate-400/60 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {p.badge}
                  </span>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-md bg-slate-200/70 px-2 py-1 text-xs text-slate-600 dark:bg-white/10 dark:text-slate-300">{t}</span>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold">
                  {p.demo && (
                    <button
                      onClick={() => setOpenDemo(p.demo)}
                      className="rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-4 py-1.5 text-white shadow shadow-brand-500/30 transition hover:scale-105"
                    >
                      ▶ Try sample demo
                    </button>
                  )}
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noreferrer" className="text-brand-500 hover:underline dark:text-accent-400">
                      Live site ↗
                    </a>
                  )}
                  {p.code && (
                    <a href={p.code} target="_blank" rel="noreferrer" className="text-slate-500 hover:underline dark:text-slate-400">
                      Source code ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      {openDemo && (
        <DemoModal title={demoTitles[openDemo]} onClose={() => setOpenDemo(null)}>
          <DemoBody id={openDemo} />
        </DemoModal>
      )}
    </Section>
  );
}

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const [status, setStatus] = useState(""); // "", "sending", "sent", "error"

  const submit = async (e) => {
    e.preventDefault();
    if (supabaseReady) {
      // Saves to your Supabase table (see database/schema.sql)
      setStatus("sending");
      try {
        await saveContactMessage(form);
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
      } catch {
        setStatus("error");
      }
      return;
    }
    // Fallback while Supabase is not set up: open the visitor's email app
    const subject = encodeURIComponent(`Portfolio message from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name} (${form.email})`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const field =
    "w-full rounded-xl border border-slate-300 bg-white/60 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-white/10 dark:bg-white/5 dark:text-white";

  return (
    <Section id="contact" className="bg-slate-100/60 dark:bg-white/[0.02]">
      <SectionTitle eyebrow="Let's work together" title="Contact Me" />
      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-400">
              I'm open to entry-level IT, web development and support roles. Send me a message — I'd love to hear from you!
            </p>
            {[
              ["✉️", profile.email, `mailto:${profile.email}`],
              ["💻", "GitHub", profile.github],
              ["💼", "LinkedIn", profile.linkedin],
            ].map(([icon, label, href]) => (
              <a key={label} href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel="noreferrer" className="glass flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition hover:translate-x-1 text-slate-700 dark:text-slate-200">
                <span className="text-lg">{icon}</span>
                {label}
              </a>
            ))}
          </div>
        </Reveal>
        <Reveal delay={100}>
          <form onSubmit={submit} className="glass space-y-4 rounded-3xl p-7">
            <input required placeholder="Your name" value={form.name} onChange={set("name")} className={field} />
            <input required type="email" placeholder="Your email" value={form.email} onChange={set("email")} className={field} />
            <textarea required rows={5} placeholder="Your message" value={form.message} onChange={set("message")} className={field} />
            <button className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:scale-[1.02]">
              {status === "sending" ? "Sending..." : "Send message"}
            </button>
            {status === "sent" && <p className="text-sm text-emerald-500">Thank you! Your message was sent.</p>}
            {status === "error" && <p className="text-sm text-red-500">Sorry, something went wrong. Please email me directly.</p>}
          </form>
        </Reveal>
      </div>
    </Section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-slate-200 px-5 py-8 text-center text-sm text-slate-500 dark:border-white/10">
      © {new Date().getFullYear()} {profile.name}. Built with React &amp; Tailwind CSS.
    </footer>
  );
}
