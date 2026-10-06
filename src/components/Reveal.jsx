import { useEffect, useRef, useState } from "react";

// Fades/slides children in when they scroll into view.
export default function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${shown ? "show" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ eyebrow, title }) {
  return (
    <div className="mb-12 text-center">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-brand-500 dark:text-accent-400">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
        {title}
      </h2>
      <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-brand-400 to-accent-400" />
    </div>
  );
}
