import { skillGroups, promptEngineering } from "../../data";
import { Section, SectionTitle } from "../ui/Section";
import Reveal from "../ui/Reveal";
import { Check } from "../ui/Icons";

export default function Skills() {
  return (
    <Section id="skills" labelledBy="skills-title" className="bg-slate-100/50 dark:bg-white/[0.015]">
      <SectionTitle
        id="skills-title"
        eyebrow="Capabilities"
        title="Skills I can put to work"
        description="A practical toolkit built through support work, development projects, and ongoing study. No percentage bars — the projects below are the evidence."
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, index) => (
          <Reveal key={group.title} delay={index * 60}>
            <article className="surface h-full p-6">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 font-display text-lg text-brand-600 dark:text-brand-400"
                >
                  {group.icon}
                </span>
                <h3 className="font-display text-base font-semibold text-slate-950 dark:text-white">
                  {group.title}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {group.description}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <div className="surface mt-8 overflow-hidden">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="eyebrow">AI-assisted development</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                {promptEngineering.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {promptEngineering.summary}
              </p>
              <ul className="mt-5 grid gap-2 text-sm text-slate-700 sm:grid-cols-2 dark:text-slate-300">
                {promptEngineering.abilities.map((ability) => (
                  <li key={ability} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {ability}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid content-center gap-3">
              {promptEngineering.specialties.map((tool) => (
                <div
                  key={tool.name}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 font-display text-xs font-bold text-white dark:bg-white dark:text-slate-950">
                    {tool.icon}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {tool.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{tool.note}</p>
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
