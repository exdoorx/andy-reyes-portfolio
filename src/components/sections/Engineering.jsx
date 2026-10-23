import { engineering } from "../../data";
import { Section, SectionTitle } from "../ui/Section";
import Reveal from "../ui/Reveal";

export default function Engineering() {
  return (
    <Section id="engineering" labelledBy="engineering-title">
      <SectionTitle
        id="engineering-title"
        eyebrow="Under the hood"
        title="How this portfolio is built"
        description="The site is intentionally small, fast, and measurable — with a real database design available if the demos are extended."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {engineering.map((item, index) => (
          <Reveal key={item.name} delay={index * 60}>
            <article className="surface h-full p-6">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl dark:bg-white/5"
              >
                {item.icon}
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-slate-950 dark:text-white">
                {item.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {item.text}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
