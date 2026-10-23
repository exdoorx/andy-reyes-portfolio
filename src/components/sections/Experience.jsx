import { experience, education } from "../../data";
import { Section, SectionTitle } from "../ui/Section";
import Reveal from "../ui/Reveal";
import { Check } from "../ui/Icons";

export default function Experience() {
  return (
    <Section
      id="experience"
      labelledBy="experience-title"
      className="bg-slate-100/50 dark:bg-white/[0.015]"
    >
      <SectionTitle
        id="experience-title"
        eyebrow="Experience"
        title="Work history"
        description="Roles across technical support, network security, and IT support — focused on investigating issues and helping users get back to work."
      />

      <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14">
        <div>
          <h3 className="mb-6 font-display text-lg font-semibold text-slate-950 dark:text-white">
            Work experience
          </h3>
          <ol className="relative space-y-7 border-l border-slate-200 pl-7 dark:border-white/10">
            {experience.map((role, index) => (
              <Reveal
                key={`${role.title}-${role.org}`}
                delay={index * 60}
                as="li"
                className="relative"
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-[43px] top-1.5 h-5 w-5 rounded-full border-2 border-white bg-brand-500 dark:border-[#070b16]"
                />
                <article className="surface p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                    {role.period}
                  </p>
                  <h4 className="mt-2 font-display text-lg font-semibold text-slate-950 dark:text-white">
                    {role.title}
                  </h4>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {role.org} · {role.kind}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{role.place}</p>
                  <ul className="mt-4 space-y-2">
                    {role.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {role.skills.map((skill) => (
                      <li key={skill} className="chip">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </ol>
        </div>

        <div>
          <h3 className="mb-6 font-display text-lg font-semibold text-slate-950 dark:text-white">
            Education
          </h3>
          <div className="space-y-6">
            {education.map((item, index) => (
              <Reveal key={item.school} delay={index * 80}>
                <article className="surface p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                    {item.period}
                  </p>
                  <h4 className="mt-2 font-display text-base font-semibold text-slate-950 dark:text-white">
                    {item.school}
                  </h4>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.program}</p>
                  {item.skills.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {item.skills.map((skill) => (
                        <li key={skill} className="chip">
                          {skill}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
