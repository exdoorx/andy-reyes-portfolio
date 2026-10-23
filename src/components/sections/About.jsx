import { profile } from "../../data";
import { Section, SectionTitle } from "../ui/Section";
import Reveal from "../ui/Reveal";
import { MapPin, Code, Wrench, Sparkles } from "../ui/Icons";

const facts = [
  { label: "Location", value: profile.location, icon: MapPin },
  { label: "Education", value: profile.course, icon: Code },
  { label: "School", value: profile.school, icon: Wrench },
  { label: "Focus", value: "Software, automation & support", icon: Sparkles },
];

export default function About() {
  return (
    <Section id="about" labelledBy="about-title">
      <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <SectionTitle
            id="about-title"
            eyebrow="About me"
            title="Technical work with a support mindset"
            description="I care about software that works for the people using it — and about the troubleshooting that keeps it working."
          />
          <Reveal>
            <div className="space-y-5 text-base leading-relaxed text-slate-600 dark:text-slate-400">
              {profile.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-8 rounded-2xl border-l-2 border-brand-500 bg-brand-500/[0.04] px-5 py-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              <strong className="font-semibold text-slate-950 dark:text-white">
                How I approach a problem:
              </strong>{" "}
              understand the user impact, reproduce the issue, find the smallest reliable fix,
              then document what changed.
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <aside className="surface p-6 sm:p-7" aria-label="Profile details">
            <h3 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
              Quick facts
            </h3>
            <dl className="mt-5 space-y-5">
              {facts.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {label}
                    </dt>
                    <dd className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                      {value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                Availability
              </p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                {profile.availability}
              </p>
            </div>
          </aside>
        </Reveal>
      </div>
    </Section>
  );
}
