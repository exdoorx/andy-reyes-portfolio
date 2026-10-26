// DEV-ONLY demo dataset for the admin dashboard.
// Consumed exclusively through a dynamic `import(...)` that is dead-code
// eliminated from production builds (guarded by import.meta.env.DEV), so
// none of this content ships in the public bundle.
// Every consumer must render it with a visible "simulated demo data" label —
// never present it as real analytics. All data is generated deterministically,
// includes zero real personal data, and uses fictional sample identities.

const seed = 42;
let state = seed;
const rand = () => {
  state = (state * 1664525 + 1013904223) % 4294967296;
  return state / 4294967296;
};

const CITIES = [
  "Quezon City, PH", "Makati, PH", "Cebu City, PH", "Davao, PH", "Manila, PH",
  "Singapore, SG", "Tokyo, JP", "Seoul, KR", "Sydney, AU", "Melbourne, AU",
  "Toronto, CA", "Vancouver, CA", "Austin, US", "Seattle, US", "London, UK",
  "Berlin, DE", "Amsterdam, NL", "Dubai, AE", "Bangkok, TH", "Kuala Lumpur, MY",
];

const DEVICES = [
  "Chrome / macOS", "Chrome / Windows", "Edge / Windows", "Firefox / Linux",
  "Safari / macOS", "Chrome / Android", "Mobile Safari / iOS", "Brave / Windows",
];

const PAGES = [
  "/#home", "/#projects", "/#skills", "/#experience",
  "/#playground", "/#engineering", "/#contact", "/#certifications",
];

function visitorRow(index) {
  const minutes = Math.floor(rand() * 13) + 1;
  const seconds = Math.floor(rand() * 60);
  const ip = `${Math.floor(rand() * 200 + 24)}.${Math.floor(rand() * 255)}.${Math.floor(rand() * 255)}.${Math.floor(rand() * 255)}`;
  const active = rand() > 0.78;
  return {
    id: `v-${index + 1}`,
    ip,
    location: CITIES[Math.floor(rand() * CITIES.length)],
    device: DEVICES[Math.floor(rand() * DEVICES.length)],
    duration: `${minutes}m ${String(seconds).padStart(2, "0")}s`,
    status: active ? "Active now" : `Left ${Math.floor(rand() * 28) + 2}m ago`,
    page: PAGES[Math.floor(rand() * PAGES.length)],
  };
}

export const demoAnalytics = {
  totalVisits: 1248563,
  uniqueVisitors: 903214,
  liveNow: 87,
  avgTimeOnSite: "5m 58s",
  bounceRate: "22.4%",
  topPages: [
    { path: "/#home", title: "Portfolio Home", views: "512,304", avgTime: "3m 41s" },
    { path: "/#projects", title: "Projects & Demos", views: "298,771", avgTime: "6m 12s" },
    { path: "/#playground", title: "Interactive Playground", views: "184,652", avgTime: "7m 28s" },
    { path: "/#contact", title: "Contact Form", views: "121,438", avgTime: "1m 44s" },
  ],
  recentVisitors: Array.from({ length: 100 }, (_, index) => visitorRow(index)),
};

const FIRST_NAMES = [
  "Maya", "Jordan", "Priya", "Daniel", "Grace", "Miguel", "Aisha", "Nathan", "Elena", "Kevin",
];

const LAST_NAMES = [
  "Santos", "Tanaka", "Okafor", "Rivera", "Sharma", "Chen", "Moreno", "Kowalski", "Bautista", "Whitfield",
];

const EMAIL_DOMAINS = [
  "gmail.com", "outlook.com", "yahoo.com", "hotmail.com", "proton.me",
];

const MESSAGE_VARIANTS = [
  "Hi Andy, I saw your portfolio and would love to discuss a custom dashboard project for our team.",
  "Hello, your networking calculator demo is exactly what my students need. Can we partner on a small deployment?",
  "Good day! We are looking for a React developer for a 3-month contract. Are you available?",
  "Hi, im impressed with the n8n automation demos. Do you do freelance integrations for small businesses?",
  "Hey, quick question — could you help us optimize a Supabase schema for our booking app?",
  "Hello! You built all these in one place? We'd like a demo of your order-tracking system for our cafe.",
  "Hi Andy, referred by a colleague. We need help rebuilding our old jQuery site into something modern.",
  "Hello, your placers page... our dev team loved the live previews. Can we book a quick call?",
  "Hi, we're hiring junior devs and your experience with technical support + development is a rare combine. Let's talk.",
  "Hi! Can your calorie planner be branded for a gym chain? We'd like a quarterly partnership.",
  "Hello, I'm a recruiter — I'll send over the JD for a full-stack role right after this.",
  "Hi, your portfolio loads super fast. Mind sharing how you handle the contact pipeline?",
];

function inquiryRow(index) {
  const first = FIRST_NAMES[index % FIRST_NAMES.length];
  const last = LAST_NAMES[(index * 7 + Math.floor(index / 10)) % LAST_NAMES.length];
  const domain = EMAIL_DOMAINS[index % EMAIL_DOMAINS.length];
  const digits = rand() > 0.5 ? Math.floor(rand() * 89 + 10) : "";
  const daysAgo = Math.floor(rand() * 90) + 1;
  const created = new Date(Date.now() - daysAgo * 86400000 - Math.floor(rand() * 86400000));
  return {
    id: `demo-msg-${index + 1}`,
    name: `${first} ${last}`,
    email: `${first}.${last.toLowerCase()}${digits}@${domain}`,
    message: MESSAGE_VARIANTS[index % MESSAGE_VARIANTS.length],
    created_at: created.toISOString(),
    _sample: true,
  };
}

export const demoInquiries = Array.from({ length: 50 }, (_, index) => inquiryRow(index));
