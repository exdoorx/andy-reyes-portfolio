// ============================================================
//  EDIT THIS FILE to update your portfolio content.
//  Everything on the website reads from here.
// ============================================================

export const profile = {
  name: "Andy Reyes",
  age: 26,
  role: "Network Security Specialist · BSIT Graduate",
  roles: [
    "Network Security Specialist",
    "BSIT Graduate",
    "Technical Support Specialist",
    "Prompt Engineer",
    "TESDA NC II & NC III Certified",
  ],
  school: "San Sebastian College - Recoletos de Manila",
  course: "Bachelor of Science in Information Technology",
  location: "Quezon City, Philippines",
  email: "areyes.ph02@gmail.com",
  github: "https://github.com/exdoorx",
  linkedin: "https://www.linkedin.com/in/areyesph/",
  about: [
    "I'm a BSIT graduate from San Sebastian College - Recoletos de Manila with remote work experience in network security and technical support.",
    "From May 2023 to November 2025 I worked as a Network Security Specialist focused on network services and network defense. Before that I was a Technical Support Specialist at ZOOSK LIMITED, working with Python and security intelligence.",
    "I'm TESDA NC II and NC III certified, I'm currently studying network, cloud and cybersecurity at the Institute of Applied Technology, and I specialize in prompt engineering with Claude, Gemini and Microsoft Copilot.",
  ],
};

export const stats = [
  { value: "3+", label: "Years in IT roles" },
  { value: "9", label: "Projects & demos" },
  { value: "7", label: "Certificates" },
  { value: "BSIT", label: "Degree earned" },
];

export const skills = [
  { name: "Network Services & Defense", level: 88 },
  { name: "Technical Support & Troubleshooting", level: 88 },
  { name: "HTML, CSS & JavaScript", level: 80 },
  { name: "React & Tailwind CSS", level: 72 },
  { name: "Python & Security Intelligence", level: 70 },
  { name: "SQL & Databases", level: 72 },
];

export const tools = [
  "VS Code", "Git & GitHub", "JavaScript", "React", "Tailwind CSS", "Python",
  "SQL / PostgreSQL", "Supabase", "Cloudflare", "Node.js", "Network Services", "Network Defense",
  "Security Intelligence", "MS Office",
];

// type: used by the filter buttons. badge: small label on the card.
export const projects = [
  {
    title: "Insurance Website",
    type: "Web",
    emoji: "🛡️",
    gradient: "from-indigo-500 to-cyan-400",
    description:
      "A responsive insurance company website that presents plans and coverage in a clear way, with an inquiry form so clients can easily get in touch.",
    tags: ["HTML", "CSS", "JavaScript", "Responsive"],
    demo: "insurance", // built-in sample demo on this site
    link: "", // <- paste your LIVE website link, e.g. "https://my-insurance-site.vercel.app"
    code: "", // <- paste your GITHUB repo link, e.g. "https://github.com/exdoorx/insurance-website"
  },
  {
    title: "Math Solver App",
    type: "App",
    emoji: "➗",
    gradient: "from-emerald-400 to-cyan-400",
    description:
      "An app that helps users solve math problems step by step — designed to make learning and checking answers fast and simple.",
    tags: ["Logic", "Algorithms", "UI Design"],
    demo: "math",
    link: "", // <- live app link
    code: "", // <- GitHub repo link
  },
  {
    title: "Old Instrument Sounds App",
    type: "App",
    emoji: "🎻",
    gradient: "from-fuchsia-500 to-orange-400",
    description:
      "A sound library app that lets people explore and play the sounds of traditional and old instruments — a fun mix of culture and technology.",
    tags: ["Audio", "Interactive", "Culture"],
    demo: "sounds",
    link: "",
    code: "",
  },
  {
    title: "Food Ordering App",
    type: "App",
    badge: "Portfolio demo",
    emoji: "🍔",
    gradient: "from-orange-500 to-rose-500",
    description:
      "A mobile-friendly ordering app: browse a menu, build a cart, see the total and place an order. Orders map to the SQL tables in the database folder.",
    tags: ["React", "Cart logic", "Supabase-ready"],
    demo: "order",
    link: "",
    code: "",
  },
  {
    title: "Appointment Booking",
    type: "Web",
    badge: "Portfolio demo",
    emoji: "🗓️",
    gradient: "from-sky-500 to-indigo-500",
    description:
      "A clinic or service booking page. Pick a service, a date and a free time slot, then get a confirmation. Includes an appointments table with double-booking protection.",
    tags: ["Forms", "Scheduling", "PostgreSQL"],
    demo: "appointment",
    link: "",
    code: "",
  },
  {
    title: "Calorie & Protein Calculator",
    type: "App",
    badge: "Portfolio demo",
    emoji: "🥗",
    gradient: "from-lime-400 to-emerald-500",
    description:
      "Enter your body details and goal to get a daily calorie target and a protein range, with a simple macro split. General estimates only.",
    tags: ["Health tech", "Formulas", "UI Design"],
    demo: "calorie",
    link: "",
    code: "",
  },
  {
    title: "Subnet Calculator",
    type: "Tool",
    badge: "Portfolio demo",
    emoji: "🌐",
    gradient: "from-cyan-400 to-blue-600",
    description:
      "Type an IPv4 address and CIDR prefix to get the network, broadcast, mask and usable host range. Built from my network services background.",
    tags: ["Networking", "IPv4", "JavaScript"],
    demo: "subnet",
    link: "",
    code: "",
  },
  {
    title: "Password Strength Checker",
    type: "Tool",
    badge: "Portfolio demo",
    emoji: "🔐",
    gradient: "from-violet-500 to-fuchsia-500",
    description:
      "Checks a password as you type and explains how to make it stronger. Everything runs in the browser and nothing is sent anywhere.",
    tags: ["Security", "Entropy", "Privacy-first"],
    demo: "password",
    link: "",
    code: "",
  },
  {
    title: "Study Planner",
    type: "App",
    badge: "Portfolio demo",
    emoji: "📚",
    gradient: "from-amber-400 to-orange-500",
    description:
      "A task planner for students: add tasks with a priority, tick them off and track your progress. Ready to connect to a Supabase table.",
    tags: ["React", "State", "Productivity"],
    demo: "planner",
    link: "",
    code: "",
  },
];

// Prompt engineering specialization
export const promptEngineering = {
  title: "Prompt Engineer",
  summary:
    "I design clear, structured prompts that get reliable results from AI assistants — for writing, coding, research, study help and everyday office work.",
  specialties: [
    { name: "Claude", note: "Anthropic", icon: "🟠" },
    { name: "Gemini", note: "Google", icon: "🔷" },
    { name: "Microsoft Copilot", note: "Microsoft", icon: "🟦" },
  ],
  abilities: [
    "Role, context & task framing",
    "Step-by-step & chain-of-thought style prompts",
    "Few-shot examples & output formats",
    "Prompt testing and iteration",
    "AI-assisted coding & debugging",
    "Workflow automation with AI",
  ],
};

// From LinkedIn: https://www.linkedin.com/in/areyesph/
export const experience = [
  {
    title: "Network Security Specialist",
    org: "Xbox Developer",
    kind: "Full-time",
    period: "May 2023 – Nov 2025 · 2 yrs 7 mos",
    place: "Quezon City, National Capital Region, Philippines · Remote",
    skills: ["Network Services", "Network Defense"],
  },
  {
    title: "Technical Support Specialist",
    org: "ZOOSK LIMITED",
    kind: "Full-time",
    period: "Aug 2022 – Apr 2023 · 9 mos",
    place: "Canada · Remote",
    skills: ["Python", "Security Intelligence", "+1 more skill"],
  },
  {
    title: "On-the-Job Training (OJT)",
    org: "Philippine National Police — San Juan City Police Station",
    kind: "Internship",
    period: "OJT certificate issued Nov 2023",
    place: "San Juan City, Philippines",
    skills: ["Office IT Support"],
  },
  {
    title: "Volunteer",
    org: "Parish Pastoral Council for Responsible Voting (PPCRV)",
    kind: "Full-time",
    period: "May 2018 – Jun 2018 · 2 mos",
    place: "Puerto Princesa, Mimaropa, Philippines · On-site",
    skills: ["Community Service", "Volunteering"],
  },
  {
    title: "Information Technology Support Specialist",
    org: "City Government of Puerto Princesa",
    kind: "Internship",
    period: "Apr 2018 – Jun 2018 · 3 mos",
    place: "Puerto Princesa, Mimaropa, Philippines · On-site",
    skills: ["Network Services"],
  },
];

export const education = [
  {
    school: "Institute of Applied Technology",
    program: "Microskills and Fundamentals, Network, Cloud and Cybersecurity",
    period: "Jan 2026 – Present",
    skills: ["Network Services", "Technology Services", "+3 skills"],
  },
  {
    school: "San Sebastian College - Recoletos de Manila",
    program: "Bachelor of Science, Information Technology",
    period: "Jun 2019 – May 2022",
    skills: [],
  },
];

export const certifications = [
  {
    title: "Network, Cybersecurity and Cloud",
    issuer: "Institute of Applied Technology",
    date: "Issued Jan 2026",
    credential: "IAT_Digital_Microskill-June2025",
    icon: "☁️",
  },
  {
    title: "Certificate for OJT",
    issuer: "San Juan City Police Dept.",
    date: "Issued Nov 2023",
    icon: "🛡️",
  },
  {
    title: "TESDA National Certificate II (NC II)",
    issuer: "TESDA — Technical Education and Skills Development Authority",
    icon: "🎓",
  },
  {
    title: "TESDA National Certificate III (NC III)",
    issuer: "TESDA — Technical Education and Skills Development Authority",
    icon: "🏅",
  },
  {
    title: "Directory Services Workshop",
    issuer: "San Sebastian College - Recoletos de Manila",
    signedBy: ["Engr. Nora N. Bautista", "Evelyn E. Oda, Ph.D."],
    icon: "🗂️",
  },
  {
    title: "Digital Application Counter Pulse Workshops",
    issuer: "San Sebastian College - Recoletos de Manila",
    signedBy: ["Engr. Nora N. Bautista", "Evelyn E. Oda, Ph.D."],
    icon: "💻",
  },
  {
    title: "Privacy and Security — Emerging Technologies Seminar",
    // TODO: your note said "HARBESSUBG" - confirm the speaker/organizer name and add it here.
    issuer: "University of the Philippines",
    icon: "🔐",
  },
];

// Data & cloud foundation (see the database/ and cloudflare/ folders)
export const dataCloud = [
  {
    name: "SQL / PostgreSQL",
    icon: "🗄️",
    text: "Relational schema for orders, appointments, tasks and contact messages, with keys, constraints and indexes. File: database/schema.sql",
  },
  {
    name: "Supabase",
    icon: "⚡",
    text: "Hosted Postgres with Row Level Security. The contact form on this site can save messages to Supabase when you add your keys.",
  },
  {
    name: "Cloudflare",
    icon: "🌩️",
    text: "Cloudflare Pages for fast hosting and a Cloudflare Worker (cloudflare/worker.js) that validates form posts before they reach the database.",
  },
  {
    name: "GitHub & CI",
    icon: "🐙",
    text: "Source on GitHub with automatic deploys to Vercel, Netlify or Cloudflare Pages on every push.",
  },
];
