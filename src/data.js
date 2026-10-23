// ============================================================
//  EDIT THIS FILE to update your portfolio content.
//  Everything on the website reads from here.
// ============================================================

export const profile = {
  name: "Andy Reyes",
  age: 26,
  role: "Network Security Specialist · Software Development",
  roles: [
    "Network Security Researcher",
    "Software Development",
    "Technical Support Specialist",
    "Master Prompt Engineer",
    "TESDA NC II & NC III Certified",
    "Automation Specialist",
  ],
  school: "San Sebastian College - Recoletos de Manila",
  course: "Bachelor of Science in Information Technology",
  location: "Quezon City, Philippines",

  email: "areyes.ph02@gmail.com",

  github: "https://github.com/exdoorx",
  linkedin: "https://www.linkedin.com/in/areyesph/",
  about: [
    "I am an Information Technology professional with hands-on experience in software development, technical support, and network security.",
    "From May 2022 to November 2025, I developed a strong foundation in software development and technical support, focusing on troubleshooting, customer service, and client satisfaction. During my tenure as a Technical Support Specialist at ZOOSK LIMITED, I utilized Python and security intelligence to conduct technical investigations and solve complex problems.",
    "I hold TESDA NC II and NC III certifications and am continuously advancing my expertise in Software Development, AI automation, and Cybersecurity at the Institute of Applied Technology. I also specialize in prompt engineering and AI-assisted workflows, leveraging tools like Claude, Google Gemini, and Microsoft Copilot to optimize productivity.",
  ],
};

export const stats = [
  { value: "3+", label: "Years in IT roles" },
  { value: "9", label: "Projects & demos" },
  { value: "7", label: "Certificates" },
  { value: "IT", label: "Field of Expertise" },
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
  "VS Code",
  "Git & GitHub",
  "JavaScript",
  "React",
  "Tailwind CSS",
  "Python",
  "SQL / PostgreSQL",
  "Supabase",
  "Cloudflare",
  "Node.js",
  "Network Services",
  "Network Defense",
  "Security Intelligence",
  "MS Office",
];

// type: used by the filter buttons. badge: small label on the card.
export const projects = [
  {
    title: "Enterprise Insurance Portal",
    type: "Web",
    emoji: "🛡️",
    gradient: "from-indigo-500 to-cyan-400",
    description:
      "A professional-grade insurance portal featuring dynamic plan comparisons and a secure client inquiry system. Optimized for high conversion and accessibility.",
    tags: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    demo: "insurance",
    link: "https://insurance-demo.vercel.app", // Sample live link
    code: "https://github.com/exdoorx/insurance-portal", // Sample repo link
  },
  {
    title: "Advanced Math Solver",
    type: "App",
    emoji: "➗",
    gradient: "from-emerald-400 to-cyan-400",
    description:
      "A comprehensive educational tool that solves complex mathematical problems with step-by-step pedagogical explanations to enhance student learning.",
    tags: ["Algorithm Design", "UI/UX", "Mathematical Logic"],
    demo: "math",
    link: "https://math-solver.vercel.app", // Sample live link
    code: "https://github.com/exdoorx/math-solver", // Sample repo link
  },
  {
    title: "Ethno-Acoustic Library",
    type: "App",
    emoji: "🎻",
    gradient: "from-fuchsia-500 to-orange-400",
    description:
      "A cultural preservation app that archives and plays traditional instrument sounds from around the world, combining heritage with modern interactive audio technology.",
    tags: ["Web Audio API", "Interactive Media", "Cultural Heritage"],
    demo: "sounds",
    link: "https://culture-sounds.vercel.app", // Sample live link
    code: "https://github.com/exdoorx/ethno-sounds", // Sample repo link
  },
  {
    title: "Full-Stack Food Ordering System",
    type: "App",
    badge: "Production Ready",
    emoji: "🍔",
    gradient: "from-orange-500 to-rose-500",
    description:
      "A complete e-commerce solution for food delivery featuring real-time cart management and a PostgreSQL backend for order tracking and inventory.",
    tags: ["React", "State Management", "Supabase/Postgres"],
    demo: "order",
    link: "https://food-order-demo.vercel.app", // Sample live link
    code: "https://github.com/exdoorx/food-ordering-system", // Sample repo link
  },
  {
    title: "Healthcare Booking Engine",
    type: "Web",
    badge: "Production Ready",
    emoji: "🗓️",
    gradient: "from-sky-500 to-indigo-500",
    description:
      "A high-availability appointment scheduling system with built-in collision detection to prevent double-booking and automate clinic workflows.",
    tags: ["Form Validation", "Scheduling Logic", "PostgreSQL"],
    demo: "appointment",
    link: "https://health-book.vercel.app", // Sample live link
    code: "https://github.com/exdoorx/appointment-booking", // Sample repo link
  },
  {
    title: "Nutritional Analysis Tool",
    type: "App",
    badge: "Production Ready",
    emoji: "🥗",
    gradient: "from-lime-400 to-emerald-500",
    description:
      "A health-tech application that calculates daily macronutrient targets based on biometric data and fitness goals using validated nutritional formulas.",
    tags: ["HealthTech", "Biometric Logic", "UI Design"],
    demo: "calorie",
    link: "https://nutrition-calc.vercel.app", // Sample live link
    code: "https://github.com/exdoorx/calorie-protein-calc", // Sample repo link
  },
  {
    title: "Network Subnet Architect",
    type: "Tool",
    badge: "Production Ready",
    emoji: "🌐",
    gradient: "from-cyan-400 to-blue-600",
    description:
      "A precision networking tool for calculating IPv4 subnet masks, broadcast addresses, and usable host ranges, tailored for network engineers.",
    tags: ["Network Engineering", "IPv4", "Binary Logic"],
    demo: "subnet",
    link: "https://subnet-calc.vercel.app", // Sample live link
    code: "https://github.com/exdoorx/subnet-calculator", // Sample repo link
  },
  {
    title: "Cyber-Security Password Auditor",
    type: "Tool",
    badge: "Production Ready",
    emoji: "🔐",
    gradient: "from-violet-500 to-fuchsia-500",
    description:
      "A privacy-first security tool that analyzes password entropy and provides real-time strength auditing without transmitting data to any server.",
    tags: ["Information Security", "Entropy Analysis", "Client-side Privacy"],
    demo: "password",
    link: "https://password-audit.vercel.app", // Sample live link
    code: "https://github.com/exdoorx/password-auditor", // Sample repo link
  },
  {
    title: "Academic Task Orchestrator",
    type: "App",
    badge: "Production Ready",
    emoji: "📚",
    gradient: "from-amber-400 to-orange-500",
    description:
      "A productivity application for students that implements priority-based task scheduling and progress tracking for academic workloads.",
    tags: ["React", "State Management", "Productivity"],
    demo: "planner",
    link: "https://planner-demo.vercel.app", // Sample live link
    code: "https://github.com/exdoorx/planner-app", // Sample repo link
  },
];

// Prompt engineering specialization
export const promptEngineering = {
  title: "Prompt Engineer & Software Developer",
  summary:
    "I specialize in designing structured, high-fidelity prompts and building robust software solutions that extract reliable, high-quality results from Large Language Models (LLMs) for software development, automation, and problem-solving.",
  specialties: [
    { name: "Claude", note: "Anthropic", icon: "🟠" },
    { name: "Gemini", note: "Google", icon: "🔷" },
    { name: "Microsoft Copilot", note: "Microsoft", icon: "🟦" },
  ],
  abilities: [
    "AI-Assisted Software Development",
    "Full-Stack Application Design & Implementation",
    "Strategic Role and Context Framing",
    "Chain-of-Thought and Multi-step Reasoning",
    "Few-shot Prompting and Output Specification",
    "Iterative Prompt Testing and Optimization",
    "AI Workflow Automation & Integration",
    "Debugging, Refactoring & Code Generation",
  ],
};

export const experience = [
  {
    title: "Network Security Specialist",
    org: "Xbox Developer",
    kind: "Full-time",
    period: "May 2023 – Present",
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
    issuer: "University of the Philippines",
    icon: "🔐",
  },
];

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
