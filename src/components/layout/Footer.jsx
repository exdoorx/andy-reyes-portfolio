import { profile } from "../../data";
import { ArrowUpRight, GitHub, LinkedIn, Mail } from "../ui/Icons";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/50 dark:border-white/10 dark:bg-white/[0.02]">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div className="max-w-sm">
            <a href="#home" className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 font-display text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                AR
              </span>
              <span className="font-display text-base font-semibold text-slate-950 dark:text-white">
                {profile.name}
              </span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {profile.shortRole} focused on practical software, clear interfaces, and
              reliable technical support.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href={`mailto:${profile.email}`}
                className="icon-button"
                aria-label={`Email ${profile.name}`}
              >
                <Mail />
              </a>
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
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm sm:grid-cols-2">
            <a href="#about" className="text-slate-600 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white">
              About
            </a>
            <a href="#projects" className="text-slate-600 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white">
              Projects
            </a>
            <a href="#skills" className="text-slate-600 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white">
              Skills
            </a>
            <a href="#contact" className="text-slate-600 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white">
              Contact
            </a>
            <a href="#experience" className="text-slate-600 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white">
              Experience
            </a>
            <a href="#credentials" className="text-slate-600 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white">
              Credentials
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:text-slate-400">
          <p>
            © {new Date().getFullYear()} {profile.name}. Built with React, Vite &amp; Tailwind CSS.
          </p>
          <a
            href="#home"
            className="inline-flex items-center gap-1.5 font-medium text-slate-600 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
          >
            Back to top
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
