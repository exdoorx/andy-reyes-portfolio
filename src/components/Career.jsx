import Reveal, { SectionTitle } from "./Reveal";
import { Section } from "./Sections";
import { experience, education, certifications, dataCloud } from "../data";

const Chip = ({ children }) => (
  <span className="rounded-full border border-brand-400/30 bg-brand-500/10 px-3 py-1 text-xs text-brand-500 dark:text-brand-400">
    {children}
  </span>
);

export function Experience() {
  return (
    <Section id="experience" className="bg-slate-100/60 dark:bg-white/[0.02]">
      <SectionTitle eyebrow="My journey" title="Experience & Education" />

      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        {/* Work */}
        <div>
          <h3 className="mb-6 font-display text-xl font-semibold text-slate-900 dark:text-white">💼 Work experience</h3>
          <div className="relative border-l-2 border-brand-400/40 pl-8">
            {experience.map((e, i) => (
              <Reveal key={e.title + e.org} delay={i * 80} className="relative mb-8 last:mb-0">
                <span className="absolute -left-[41px] top-1.5 h-5 w-5 rounded-full bg-gradient-to-br from-brand-500 to-accent-400 ring-4 ring-slate-100 dark:ring-[#0b1020]" />
                <div className="glass rounded-2xl p-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent-500">{e.period}</span>
                  <h4 className="mt-1 font-display text-lg font-semibold text-slate-900 dark:text-white">{e.title}</h4>
                  <p className="text-sm text-brand-500 dark:text-brand-400">
                    {e.org} · {e.kind}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">📍 {e.place}</p>
                  {e.skills?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {e.skills.map((s) => <Chip key={s}>{s}</Chip>)}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <h3 className="mb-6 font-display text-xl font-semibold text-slate-900 dark:text-white">🎓 Education</h3>
          <div className="space-y-5">
            {education.map((ed, i) => (
              <Reveal key={ed.school} delay={i * 100}>
                <div className="glass rounded-2xl p-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent-500">{ed.period}</span>
                  <h4 className="mt-1 font-display text-lg font-semibold text-slate-900 dark:text-white">{ed.school}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{ed.program}</p>
                  {ed.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {ed.skills.map((s) => <Chip key={s}>{s}</Chip>)}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

export function Certifications() {
  return (
    <Section id="certs">
      <SectionTitle eyebrow="Proof of skill" title="Licenses, Certificates & Workshops" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((c, i) => (
          <Reveal key={c.title} delay={(i % 3) * 100}>
            <div className="glass relative h-full overflow-hidden rounded-3xl p-7 transition hover:-translate-y-2">
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br from-brand-500/30 to-accent-400/30 blur-2xl" />
              <div className="relative">
                <div className="mb-3 text-4xl">{c.icon}</div>
                <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{c.title}</h3>
                <p className="mt-1 text-sm text-brand-500 dark:text-brand-400">{c.issuer}</p>
                {c.date && <p className="mt-1 text-xs text-slate-500">{c.date}</p>}
                {c.credential && (
                  <p className="mt-1 break-all text-xs text-slate-500">Credential ID: {c.credential}</p>
                )}
                {c.signedBy && (
                  <p className="mt-3 border-t border-slate-200 pt-3 text-xs text-slate-500 dark:border-white/10">
                    Signed by {c.signedBy.join(" and ")}
                  </p>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function DataCloud() {
  return (
    <Section id="cloud" className="bg-slate-100/60 dark:bg-white/[0.02]">
      <SectionTitle eyebrow="Under the hood" title="Data & Cloud Foundation" />
      <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-slate-600 dark:text-slate-400">
        The portfolio ships with a real database design and cloud setup, so the demo projects can be
        turned into working apps.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {dataCloud.map((d, i) => (
          <Reveal key={d.name} delay={i * 90}>
            <div className="glass h-full rounded-3xl p-6 transition hover:-translate-y-2">
              <div className="mb-3 text-3xl">{d.icon}</div>
              <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{d.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{d.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
