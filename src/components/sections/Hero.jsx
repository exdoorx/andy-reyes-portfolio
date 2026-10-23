import { profile, stats } from "../../data";
import { ArrowRight, Download, GitHub, LinkedIn, Mail } from "../ui/Icons";

const focusAreas = [
  { label: "Software development", icon: "⌘" },
  { label: "AI automation", icon: "✦" },
  { label: "Technical support", icon: "◎" },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100dvh] items-center overflow-hidden px-5 pb-16 pt-28 sm:px-8 sm:pt-32"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="hero-grid absolute inset-0 opacity-70" />
        <div className="absolute -right-24 top-24 h-80 w-80 rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-500/20" />
        <div className="absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-accent-500/10 blur-3xl dark:bg-accent-500/10" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Available for new opportunities
          </p>

          <h1 className="mt-6 font-display text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl dark:text-white">
            Andy <span className="gradient-text">Reyes</span>
          </h1>

          <p className="mt-4 text-base font-semibold text-slate-700 sm:text-lg dark:text-slate-200">
            Software Developer <span className="text-slate-400">/</span> AI Automation{" "}
            <span className="text-slate-400">/</span> Technical Support
          </p>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">
            I build practical software solutions, automate workflows, and solve technical
            problems. With experience in software development support and customer-facing
            technical roles, I combine development skills with a problem-solving mindset to
            deliver reliable, user-focused solutions.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" className="btn btn-primary">
              View my projects
              <ArrowRight />
            </a>
            <a href="#contact" className="btn btn-secondary">
              Contact me
              <Mail className="h-4 w-4" />
            </a>
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} download className="btn btn-ghost">
                Download resume
                <Download />
              </a>
            )}
          </div>

          <div className="mt-7 flex items-center gap-1">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-button"
              aria-label="GitHub profile"
            >
              <GitHub />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-button"
              aria-label="LinkedIn profile"
            >
              <LinkedIn />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="icon-button"
              aria-label={`Email ${profile.name}`}
            >
              <Mail />
            </a>
            <span className="ml-2 hidden text-xs text-slate-500 sm:block dark:text-slate-400">
              {profile.location}
            </span>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-slate-200 pt-7 sm:grid-cols-4 dark:border-white/10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-2xl font-semibold text-slate-950 dark:text-white">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-xs leading-snug text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mx-auto w-full max-w-sm lg:max-w-none">
          <div className="relative">
            <div className="absolute -inset-3 -rotate-2 rounded-[2.2rem] border border-brand-500/20 bg-brand-500/5" />
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 shadow-xl shadow-slate-900/10 dark:border-white/10 dark:bg-white/5 dark:shadow-black/30">
              <picture>
                <source
                  type="image/webp"
                  srcSet="/andy-480.webp 480w, /andy-800.webp 800w"
                  sizes="(min-width: 1024px) 380px, 80vw"
                />
                <img
                  src="/andy.jpg"
                  alt="Portrait of Andy Reyes"
                  width="800"
                  height="800"
                  fetchPriority="high"
                  decoding="async"
                  className="aspect-square w-full object-cover"
                />
              </picture>
            </div>

            <div className="absolute -bottom-4 left-4 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur dark:border-white/10 dark:bg-[#10182b]/95">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Based in
              </p>
              <p className="mt-0.5 text-sm font-semibold text-slate-950 dark:text-white">
                {profile.location}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-2">
            {focusAreas.map((area) => (
              <div
                key={area.label}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-white/[0.035] dark:text-slate-200"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-xs text-brand-600 dark:text-brand-400">
                  {area.icon}
                </span>
                {area.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
