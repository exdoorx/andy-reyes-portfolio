import { useEffect, useState } from "react";
import { profile } from "../data";

function useTypewriter(words, speed = 70, pause = 1400) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[i % words.length];
    const done = !deleting && text === word;
    const empty = deleting && text === "";
    const t = setTimeout(
      () => {
        if (done) return setDeleting(true);
        if (empty) {
          setDeleting(false);
          return setI(i + 1);
        }
        setText(word.slice(0, text.length + (deleting ? -1 : 1)));
      },
      done ? pause : deleting ? speed / 2 : speed
    );
    return () => clearTimeout(t);
  }, [text, deleting, i, words, speed, pause]);

  return text;
}

export default function Hero() {
  const typed = useTypewriter(profile.roles);

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden px-5 pt-24 pb-16">
      {/* animated background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-10 h-96 w-96 animate-blob rounded-full bg-brand-500/30 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 animate-blob rounded-full bg-accent-500/25 blur-3xl [animation-delay:-5s]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 animate-blob rounded-full bg-mint-400/20 blur-3xl [animation-delay:-9s]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.18)_1px,transparent_0)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-[1.15fr_0.85fr]">
        <div className="text-center md:text-left">
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-mint-400" />
            Open for new opportunities
          </span>

          <h1 className="mt-6 font-display text-5xl font-bold leading-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
            Hi, I'm <span className="gradient-text">{profile.name}</span>
          </h1>

          <p className="mt-5 h-8 font-display text-xl text-slate-600 dark:text-slate-300 sm:text-2xl">
            {typed}
            <span className="ml-0.5 inline-block w-0.5 animate-blink bg-accent-400 align-middle">&nbsp;</span>
          </p>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400 md:mx-0">
            {profile.course} graduate with remote experience in network security and technical
            support. I also build clean, useful web and app projects.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <a
              href="#projects"
              className="rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:scale-105"
            >
              View my work
            </a>
            <a
              href="#contact"
              className="glass rounded-full px-7 py-3 text-sm font-semibold text-slate-800 transition hover:scale-105 dark:text-white"
            >
              Hire me
            </a>
          </div>
        </div>

        {/* photo */}
        <div className="relative mx-auto w-64 sm:w-80">
          <div className="absolute -inset-3 animate-spin rounded-full bg-[conic-gradient(from_0deg,#6366f1,#22d3ee,#34d399,#6366f1)] opacity-70 blur-md [animation-duration:10s]" />
          <div className="relative animate-float overflow-hidden rounded-full border-4 border-white/20 bg-slate-900 shadow-2xl">
            <img
              src="/andy.jpg"
              alt="Portrait of Andy Reyes"
              width="800"
              height="800"
              className="aspect-square w-full object-cover"
            />
          </div>
          <div className="glass absolute -bottom-2 -left-4 animate-float rounded-2xl px-4 py-2 text-xs font-semibold text-slate-800 [animation-delay:-2s] dark:text-white">
            🛡️ Network Security
          </div>
          <div className="glass absolute -right-4 top-6 animate-float rounded-2xl px-4 py-2 text-xs font-semibold text-slate-800 [animation-delay:-4s] dark:text-white">
            ✅ TESDA NC II &amp; III
          </div>
        </div>
      </div>
    </section>
  );
}
