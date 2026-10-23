export function Section({ id, children, className = "", labelledBy }) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`section-shell px-5 py-20 sm:px-8 sm:py-24 ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionTitle({ id, eyebrow, title, description, align = "left" }) {
  const centered = align === "center";
  return (
    <div className={`mb-12 max-w-2xl ${centered ? "mx-auto text-center" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2
        id={id}
        className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}
