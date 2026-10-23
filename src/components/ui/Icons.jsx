const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function ArrowRight({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...base}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRight({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...base}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function Download({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...base}>
      <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16" />
    </svg>
  );
}

export function Menu({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...base}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function Close({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...base}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function Sun({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...base}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function Moon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...base}>
      <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
    </svg>
  );
}

export function Mail({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...base}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function MapPin({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...base}>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function Check({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...base}>
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export function Copy({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...base}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export function ExternalLink({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...base}>
      <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

export function GitHub({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 .8a11.4 11.4 0 0 0-3.6 22.2c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.3 11.3 0 0 1 6 0C17.7 4.7 18.7 5 18.7 5c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.4 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5A11.4 11.4 0 0 0 12 .8Z" />
    </svg>
  );
}

export function LinkedIn({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M20.4 20.4h-3.5v-5.5c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.6H9.4V9h3.4v1.6h.1c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.2 2.3 4.2 5.4v6.3ZM5.3 7.4a2 2 0 1 1 0-4.1 2 2 0 0 1 0 4.1Zm1.8 13H3.6V9h3.5v11.4ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 1 .8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7c0-1-.8-1.7-1.8-1.7Z" />
    </svg>
  );
}

export function Code({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...base}>
      <path d="m8 9-3 3 3 3M16 9l3 3-3 3M13.5 5l-3 14" />
    </svg>
  );
}

export function Sparkles({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...base}>
      <path d="m12 3 1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3L12 3ZM18.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2ZM5.5 14l.6 1.7 1.7.6-1.7.6L5.5 19l-.6-1.7-1.7-.6 1.7-.6.6-1.7Z" />
    </svg>
  );
}

export function Shield({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...base}>
      <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function Wrench({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...base}>
      <path d="M14.7 6.3a4.5 4.5 0 0 0-5.6 5.6L3 18l3 3 6.1-6.1a4.5 4.5 0 0 0 5.6-5.6l-2.8 2.8-2.5-2.5 2.3-3.3Z" />
    </svg>
  );
}

export function Database({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...base}>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </svg>
  );
}
