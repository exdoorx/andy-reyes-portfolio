import { useEffect, useState } from "react";
import { profile } from "../data";

const links = [
  ["About", "#about"],
  ["Skills", "#skills"],
  ["Projects", "#projects"],
  ["Experience", "#experience"],
  ["Certificates", "#certs"],
  ["Contact", "#contact"],
];

export default function Navbar({ dark, toggleDark }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled ? "glass shadow-lg shadow-black/5" : ""
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#home" className="font-display text-xl font-bold text-slate-900 dark:text-white">
          andy<span className="gradient-text">.dev</span>
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {links.map(([label, href]) => (
            <li key={href}>
              <a
                href={href}
                className="text-sm font-medium text-slate-600 transition hover:text-brand-500 dark:text-slate-400 dark:hover:text-accent-400"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="glass flex h-10 w-10 items-center justify-center rounded-full text-lg transition hover:scale-110"
          >
            {dark ? "☀️" : "🌙"}
          </button>
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            className="glass flex h-10 w-10 items-center justify-center rounded-full md:hidden"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass mx-4 mb-3 rounded-2xl p-4 md:hidden">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-white/10 dark:text-slate-200"
            >
              {label}
            </a>
          ))}
          <p className="mt-2 px-3 text-xs text-slate-500">{profile.name}</p>
        </div>
      )}
    </header>
  );
}
