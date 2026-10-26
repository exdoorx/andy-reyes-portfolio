import { Section, SectionTitle } from "../ui/Section";
import Reveal from "../ui/Reveal";
import { workedWith, toolkit } from "../../data/brands";

// Simplified geometric brand marks (not official trademark artwork).
// Each renders inside a small fixed-height chip next to the name.
function LogoMark({ icon }) {
  switch (icon) {
    case "zoosk":
      return (
        <svg viewBox="0 0 40 32" className="h-7 w-9" aria-hidden="true">
          <rect x="2" y="4" width="36" height="24" rx="8" fill="#00aff5" />
          <path d="M14 10h12l-8 12h8" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "xbox":
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <circle cx="16" cy="16" r="14" fill="#107c10" />
          <path
            d="M9 9c4 3 10 8 14 14M23 9c-4 3-10 8-14 14"
            stroke="#fff"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );
    case "uber":
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <circle cx="16" cy="16" r="14" fill="#090909" />
          <text x="16" y="21" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">U</text>
        </svg>
      );
    case "sykes":
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <rect x="3" y="3" width="26" height="26" rx="7" fill="#0b326b" />
          <path d="M20 10.5c-1.2-1.4-2.9-2-4.6-2-2.6 0-4.6 1.4-4.6 3.7 0 2.2 1.8 3 4.6 3.8 2.9.8 4.9 1.7 4.9 4.1 0 2.4-2.1 3.9-5 3.9-2 0-3.8-.8-5-2.2" stroke="#e4002b" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        </svg>
      );
    case "foundever":
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <rect x="3" y="3" width="26" height="26" rx="7" fill="#ff5451" />
          <text x="16" y="22" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff">F</text>
        </svg>
      );
    case "concentrix":
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <rect x="3" y="3" width="26" height="26" rx="7" fill="#0a7f5b" />
          <path d="M21 11a7 7 0 1 0 0 10" stroke="#ffb612" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          <circle cx="21.5" cy="16" r="1.8" fill="#ffb612" />
        </svg>
      );
    case "taskus":
      return (
        <svg viewBox="0 0 40 32" className="h-7 w-9" aria-hidden="true">
          <circle cx="20" cy="16" r="13" fill="#22d3a5" />
          <path d="M14 16.5l4 4 8-9" stroke="#083344" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    /** Sample school crest: shield + book (stand-in for IAT logo) */
    case "iat":
      return (
        <svg viewBox="0 0 32 36" className="h-7 w-7" aria-hidden="true">
          <path d="M16 2 30 6v12c0 9-7 14-14 16C9 32 2 27 2 18V6l14-4Z" fill="#1d4ed8" />
          <path d="M9 13c2.5-1.5 5-1.5 7 0 2-1.5 4.5-1.5 7 0v6c-2.5-1.5-5-1.5-7 0-2-1.5-4.5-1.5-7 0v-6Z" fill="#fff" />
          <path d="M16 13v6" stroke="#1d4ed8" strokeWidth="1.4" />
        </svg>
      );
    /** Sample collegiate crest: shield with cross/flame (stand-in for SSC Manila logo) */
    case "sansebastian":
      return (
        <svg viewBox="0 0 32 36" className="h-7 w-7" aria-hidden="true">
          <path d="M16 2 30 6v12c0 9-7 14-14 16C9 32 2 27 2 18V6l14-4Z" fill="#7f1d1d" />
          <path d="M16 8v14M10 13h12" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          <circle cx="16" cy="26" r="2.4" fill="#fbbf24" />
        </svg>
      );
    /** Sample circular government seal with sun + landscape (stand-in for Puerto Princesa city seal) */
    case "princesa":
      return (
        <svg viewBox="0 0 36 36" className="h-7 w-7" aria-hidden="true">
          <circle cx="18" cy="18" r="15" fill="#166534" />
          <circle cx="18" cy="18" r="11.5" fill="none" stroke="#fef08a" strokeWidth="1.6" strokeDasharray="2.2 2.6" />
          <path d="M9 22c2-4 4-6 9-6s7 2 9 6" fill="#16a34a" stroke="#bbf7d0" strokeWidth="1.2" />
          <path d="M11 22h14" stroke="#38bdf8" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="18" cy="12" r="2.8" fill="#fde047" />
          <path d="M18 8.6v-1.4M21.1 10l1-1M23.9 12h1.4M14.9 10l-1-1M12.1 12h-1.4" stroke="#fde047" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case "react":
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <circle cx="16" cy="16" r="2.6" fill="#61dafb" />
          <g stroke="#61dafb" strokeWidth="1.6" fill="none">
            <ellipse cx="16" cy="16" rx="12" ry="5" />
            <ellipse cx="16" cy="16" rx="12" ry="5" transform="rotate(60 16 16)" />
            <ellipse cx="16" cy="16" rx="12" ry="5" transform="rotate(120 16 16)" />
          </g>
        </svg>
      );
    case "vite":
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <path d="M16 3 29 26H3L16 3Z" fill="#646cff" />
          <path d="M17.5 9 13 17h3l-1.5 6L20 15h-3l2-6h-1.5Z" fill="#ffd62e" />
        </svg>
      );
    case "tailwind":
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <path
            d="M3 17c0-4.5 2.6-7.2 7-7.2 5.8 0 6.6 4.3 9.5 4.3 2 0 3.5-1 3.5-2.7 0-1.6-1.2-2.4-1.2-2.4"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M29 15c0 4.5-2.6 7.2-7 7.2-5.8 0-6.6-4.3-9.5-4.3-2 0-3.5 1-3.5 2.7 0 1.6 1.2 2.4 1.2 2.4"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );
    case "supabase":
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <rect x="3" y="3" width="26" height="26" rx="7" fill="#3ecf8e" />
          <path d="M17 6v11h7l-9 9V15H8l9-9Z" fill="#fff" />
        </svg>
      );
    case "cloudflare":
      return (
        <svg viewBox="0 0 40 28" className="h-7 w-10" aria-hidden="true">
          <path
            d="M30 9a9 9 0 0 0-17-2.6A6.5 6.5 0 0 0 5 12.9c0 3.4 2.6 5.1 6 5.1h17c3.9 0 7-2.4 7-6.2A6.3 6.3 0 0 0 30 9Z"
            fill="#f6821f"
          />
        </svg>
      );
    case "vercel":
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <path d="M16 5 29 27H3L16 5Z" className="fill-slate-900 dark:fill-white" />
        </svg>
      );
    case "postgres":
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <circle cx="16" cy="16" r="13" fill="#336791" />
          <text x="16" y="21" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">PG</text>
        </svg>
      );
    case "js":
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <rect x="3" y="3" width="26" height="26" rx="5" fill="#f7df1e" />
          <text x="16" y="22" textAnchor="middle" fontSize="12" fontWeight="800" fill="#1a1a1a">JS</text>
        </svg>
      );
    case "vitest":
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <circle cx="16" cy="16" r="13" fill="#fcc21b" />
          <path d="M9 15l5 5 9-10" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    case "eslint":
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <rect x="3" y="3" width="26" height="26" rx="6" fill="#4b32c3" />
          <path d="M11 12l5-3 5 3v8l-5 3-5-3v-8Z" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinejoin="round" />
        </svg>
      );
    case "git":
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <rect x="3" y="3" width="26" height="26" rx="6" transform="rotate(45 16 16)" fill="#f05133" />
          <circle cx="11" cy="21" r="2.6" fill="#fff" />
          <circle cx="22" cy="10" r="2.6" fill="#fff" />
          <path d="M11.5 19.5 21 11" stroke="#fff" strokeWidth="2.4" />
        </svg>
      );
    case "vscode":
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <path d="M23 3 11 15 6 11 3 13l6 4-6 4 3 2 5-4 12 12V3Z" fill="#0098ff" />
        </svg>
      );
    default:
      return null;
  }
}

function LogoChip({ item }) {
  return (
    <div className="logo-chip flex shrink-0 items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white/80 px-5 py-3 dark:border-white/10 dark:bg-white/[0.04]">
      <LogoMark icon={item.icon} />
      <div className="whitespace-nowrap">
        <span className="block font-display text-sm font-bold text-slate-950 dark:text-white">{item.name}</span>
        {item.note && (
          <span className="block text-[10px] uppercase tracking-wider text-slate-500">{item.note}</span>
        )}
      </div>
    </div>
  );
}

function MarqueeRow({ items, reverse = false, duration = "36s" }) {
  // Duplicated sequence gives a seamless infinite loop.
  const loop = [...items, ...items];
  return (
    <div className="logos-scroller relative overflow-hidden py-1 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div
        className="logos-track flex w-max items-center gap-4"
        style={{ animation: `logo-marquee ${duration} linear infinite`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        {loop.map((item, index) => (
          <LogoChip key={`${item.name}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function Brands() {
  return (
    <Section id="partners" labelledBy="partners-title">
      <Reveal>
        <SectionTitle
          id="partners-title"
          eyebrow="Who I've worked with"
          title="Brands, employers, education & the toolbox"
          description="Brand and platform engagements, customer-service and BPO employers, schools, and local government — plus the exact stack used to design, build, test, and deploy this site."
        />
        <div className="space-y-4">
          <MarqueeRow items={workedWith} duration="48s" />
          <MarqueeRow items={toolkit} reverse duration="48s" />
        </div>
      </Reveal>
    </Section>
  );
}
