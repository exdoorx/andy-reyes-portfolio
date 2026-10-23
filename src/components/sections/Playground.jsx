import { playground } from "../../data";
import { Section, SectionTitle } from "../ui/Section";
import Reveal from "../ui/Reveal";
import { Cube, Sparkles, ArrowRight, ArrowUpRight, Copy, Check } from "../ui/Icons";
import { useState } from "react";

export default function Playground() {
  const { htb, automation } = playground;
  const [copied, setCopied] = useState(false);

  const copyCodename = async () => {
    try {
      await navigator.clipboard.writeText(htb.codename);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Section id="playground" labelledBy="playground-title">
      <SectionTitle
        id="playground-title"
        eyebrow="Playground"
        title="Hobbies & playing grounds"
        description="Where I sharpen skills outside of work: hands-on security challenges and AI-assisted workflow experiments."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <a
            href={htb.url}
            target="_blank"
            rel="noopener noreferrer"
            className="surface surface-hover group flex h-full flex-col p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-center gap-4">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-xl text-[#9acc00]"
                style={{ backgroundColor: "rgba(154, 204, 0, 0.12)" }}
              >
                <Cube />
              </span>
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
                  {htb.platform}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Hands-on cybersecurity challenges
                </p>
              </div>
              <span
                className="chip border-transparent"
                style={{ color: "#8fbe00" }}
              >
                Hacker rank reached
              </span>
            </div>

            <div className="mt-8 flex flex-wrap items-end gap-x-3 gap-y-2">
              <p className="font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
                @{htb.codename}
              </p>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  copyCodename();
                }}
                className="icon-button h-8 w-8 border-0 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                aria-label="Copy codename"
                aria-live="polite"
              >
                {copied ? <Check className="text-emerald-500" /> : <Copy />}
              </button>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 sm:max-w-xs">
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-white/10">
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Level
                </dt>
                <dd className="mt-1 font-display text-2xl font-bold text-slate-950 dark:text-white">
                  {htb.level}
                </dd>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-white/10">
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Rank
                </dt>
                <dd className="mt-1 font-display text-xl font-bold leading-tight text-slate-950 dark:text-white">
                  {htb.rank}
                </dd>
              </div>
            </dl>

            <p className="mt-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {htb.blurb}
            </p>

            <p className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-brand-600 transition group-hover:gap-3 dark:text-brand-400">
              View Hack The Box profile
              <ArrowUpRight className="h-4 w-4" />
            </p>
          </a>
        </Reveal>

        <Reveal delay={90}>
          <article className="surface surface-hover flex h-full flex-col p-6 sm:p-8">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400"
            >
              <Sparkles />
            </span>
            <h3 className="mt-5 font-display text-lg font-semibold text-slate-950 dark:text-white">
              {automation.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {automation.text}
            </p>

            <ul className="mt-5 flex flex-wrap gap-1.5">
              {automation.chips.map((item) => (
                <li key={item} className="chip text-[11px]">
                  {item}
                </li>
              ))}
            </ul>

            <a
              href={automation.action.href}
              className="btn btn-secondary mt-auto w-full"
            >
              {automation.action.label}
              <ArrowRight />
            </a>
          </article>
        </Reveal>
      </div>
    </Section>
  );
}
