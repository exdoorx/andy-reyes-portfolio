// ============================================================
//  Portfolio content
//  Update this file to change the copy, projects, and links.
//  Keep claims factual: every project below is a working demo
//  in this repository unless its status says otherwise.
// ============================================================

export const site = {
  url: "https://areyes-eight.vercel.app",
  title: "Andy Reyes | Software Developer & Technical Support",
  description:
    "Portfolio of Andy Reyes, a software developer and technical support professional focused on practical web applications, AI automation, and reliable troubleshooting.",
};

export const profile = {
  name: "Andy Reyes",
  firstName: "Andy",
  headline: "Software Developer | AI Automation | Technical Support",
  shortRole: "Software Developer & Technical Support",
  location: "Quezon City, Philippines",
  email: "areyes.ph02@gmail.com",
  github: "https://github.com/exdoorx",
  linkedin: "https://www.linkedin.com/in/areyesph/",
  // Add a real PDF to public/ first, then set this to e.g. "/andy-reyes-resume.pdf".
  // The download button stays hidden while this is empty.
  resumeUrl: "",
  availability:
    "Open to software development, AI automation, and technical support roles.",
  school: "San Sebastian College - Recoletos de Manila",
  course: "Bachelor of Science in Information Technology",
  about: [
    "I'm an IT professional with hands-on experience in software development support, technical support, and network security. I enjoy turning messy technical problems into clear, reliable solutions.",
    "At ZOOSK Limited, I used Python and security intelligence to investigate complex technical issues and supported customers through resolution. I've also worked in remote technical roles that required clear communication, careful troubleshooting, and a customer-first approach.",
    "I hold TESDA NC II and NC III certifications and continue building my skills in software development, AI automation, and cybersecurity. I use Claude, Google Gemini, and Microsoft Copilot to speed up research, prototyping, and repetitive workflows — while keeping the final implementation reviewed and intentional.",
  ],
};

export const stats = [
  { value: "3+", label: "Years in technical roles" },
  { value: "9", label: "Working in-page demos" },
  { value: "7", label: "Certificates & workshops" },
  { value: "BSIT", label: "Information Technology" },
];

export const skillGroups = [
  {
    title: "Programming & Frontend",
    icon: "⌘",
    description: "Building responsive, accessible interfaces with modern JavaScript.",
    items: ["JavaScript (ES6+)", "HTML5", "CSS3", "React", "Tailwind CSS", "Responsive UI"],
  },
  {
    title: "Development Tools",
    icon: "⚙",
    description: "The day-to-day tools I use to build, test, and ship.",
    items: ["Git", "GitHub", "VS Code", "Vite", "Node.js", "npm"],
  },
  {
    title: "AI & Automation",
    icon: "✦",
    description: "Using AI deliberately for research, prototyping, and repeatable workflows.",
    items: [
      "Prompt engineering",
      "Claude",
      "Google Gemini",
      "Microsoft Copilot",
      "AI-assisted development",
      "Workflow automation",
    ],
  },
  {
    title: "Data, APIs & Cloud",
    icon: "◇",
    description: "Working with relational data, APIs, and lightweight cloud services.",
    items: ["SQL / PostgreSQL", "Supabase", "REST APIs", "Cloudflare Workers", "Row Level Security"],
  },
  {
    title: "Technical Support",
    icon: "◎",
    description: "Investigating problems and communicating fixes clearly to real users.",
    items: [
      "Technical troubleshooting",
      "Issue investigation",
      "Customer communication",
      "Documentation",
      "Remote support",
    ],
  },
  {
    title: "Network & Security",
    icon: "⬡",
    description: "Networking fundamentals and security-minded problem solving.",
    items: ["Network services", "Network defense", "Security intelligence", "IPv4 / subnetting", "Security fundamentals"],
  },
];

// type is used by the filter buttons. Every demo below is implemented
// in src/components/demos and runs entirely in the browser.
export const projects = [
  {
    id: "insurance",
    title: "Insurance Plan Comparison Portal",
    type: "Web",
    status: "Interactive prototype",
    emoji: "🛡️",
    accent: "#6366f1",
    summary:
      "A quote estimator that makes plan differences easy to compare before a customer talks to an agent.",
    problem:
      "Insurance plan details are difficult to compare when coverage, age, and plan tiers all change the price.",
    role: "Designed the comparison flow and built the interactive quote calculator and responsive layout.",
    features: [
      "Age and coverage controls",
      "Three plan tiers with plain-language perks",
      "Instant monthly premium estimate",
    ],
    technical:
      "Client-side pricing logic combines coverage, age band, and plan multiplier. No data leaves the browser.",
    tech: ["React", "Tailwind CSS", "State-driven forms"],
    demo: "insurance",
  },
  {
    id: "math",
    title: "Step-by-Step Math Solver",
    type: "Tool",
    status: "Working tool",
    emoji: "➗",
    accent: "#10b981",
    summary:
      "A small expression engine that evaluates arithmetic and solves linear equations with visible steps.",
    problem:
      "A calculator gives an answer, but it rarely shows how the answer was reached.",
    role: "Built the tokenizer, recursive-descent parser, equation solver, and the interface around it.",
    features: [
      "Operator precedence and parentheses",
      "Implicit multiplication such as 3(x - 2)",
      "Linear equation solving with step explanations",
      "Friendly errors for invalid input",
    ],
    technical:
      "A hand-written tokenizer and recursive-descent parser support +, −, ×, ÷, powers, unary signs, parentheses, and a single variable.",
    tech: ["React", "JavaScript", "Parsing"],
    demo: "math",
  },
  {
    id: "sounds",
    title: "Ethno-Acoustic Instrument Explorer",
    type: "App",
    status: "Interactive prototype",
    emoji: "🎻",
    accent: "#d946ef",
    summary:
      "A cultural reference that introduces traditional Philippine instruments and plays synthesized tone previews.",
    problem:
      "Instrument references are often text-only, and external audio files are slow or unavailable.",
    role: "Built the instrument browser, the Web Audio tone generator, and the accompanying scale guide.",
    features: [
      "Four traditional instruments with context",
      "Locally synthesized reference tones",
      "Scale and accompaniment suggestions",
      "Works without external audio files",
    ],
    technical:
      "Tone previews are generated with the Web Audio API oscillators, so the demo has no CDN dependency or audio licensing issue. They are synthesized references, not recordings.",
    tech: ["React", "Web Audio API", "Interaction design"],
    demo: "sounds",
  },
  {
    id: "order",
    title: "Food Ordering Interface",
    type: "App",
    status: "Interactive prototype",
    emoji: "🍔",
    accent: "#f97316",
    summary:
      "A compact ordering flow with menu browsing, quantity controls, a live cart total, and a checkout summary.",
    problem:
      "Small food businesses need a clear ordering flow that stays understandable on a phone.",
    role: "Built the menu, cart state, quantity handling, and checkout confirmation flow.",
    features: [
      "Responsive product grid",
      "Live item count and order total",
      "Quantity controls with empty-cart handling",
      "Simulated order confirmation",
    ],
    technical:
      "Cart state is normalized by item id, with derived totals calculated from the menu source of truth. Checkout is intentionally a client-side simulation.",
    tech: ["React", "State management", "Responsive UI"],
    demo: "order",
  },
  {
    id: "appointment",
    title: "Clinic Appointment Scheduler",
    type: "Web",
    status: "Interactive prototype",
    emoji: "🗓️",
    accent: "#0ea5e9",
    summary:
      "A booking form that prevents incomplete appointments and makes unavailable time slots obvious.",
    problem:
      "Manual appointment booking leads to double entries, missed fields, and unclear availability.",
    role: "Implemented the service/date/time flow, simulated availability, and confirmation state.",
    features: [
      "Service selection",
      "Date-aware slot availability",
      "Required customer details",
      "Confirmation summary",
    ],
    technical:
      "Slot availability is deterministic for each date so the demo behaves consistently. A production version would enforce the same rule with a unique database index.",
    tech: ["React", "Form validation", "Scheduling logic"],
    demo: "appointment",
  },
  {
    id: "nutrition",
    title: "Nutrition Target Calculator",
    type: "Tool",
    status: "Working tool",
    emoji: "🥗",
    accent: "#22c55e",
    summary:
      "A health-tech calculator that estimates daily calories and macronutrient targets from body data and goals.",
    problem:
      "Generic calorie numbers ignore body size, activity level, and the user's goal.",
    role: "Built the calculator and the responsive results presentation.",
    features: [
      "Mifflin-St Jeor BMR estimate",
      "Activity-adjusted daily calories",
      "Protein, carbohydrate, and fat targets",
      "Clear non-medical disclaimer",
    ],
    technical:
      "Calculations run locally and update immediately. Protein ranges vary by goal, and the interface labels the output as a general estimate rather than medical advice.",
    tech: ["React", "Health calculations", "Accessible forms"],
    demo: "calorie",
  },
  {
    id: "subnet",
    title: "IPv4 Subnet Calculator",
    type: "Tool",
    status: "Working tool",
    emoji: "🌐",
    accent: "#0891b2",
    summary:
      "A networking utility that converts CIDR notation into network, broadcast, and usable host ranges.",
    problem:
      "Manual subnet math is error-prone, especially at /31 and /32 where the usual host-count formula breaks.",
    role: "Implemented the CIDR parser, bitwise calculations, and input validation.",
    features: [
      "CIDR parsing and octet validation",
      "Network and broadcast addresses",
      "First/last usable host",
      "Correct /31 and /32 handling",
    ],
    technical:
      "Uses unsigned 32-bit integer operations and handles the RFC 3021 point-to-point /31 case separately from /32.",
    tech: ["React", "JavaScript", "Networking"],
    demo: "subnet",
  },
  {
    id: "password",
    title: "Password Strength Auditor",
    type: "Tool",
    status: "Working tool",
    emoji: "🔐",
    accent: "#8b5cf6",
    summary:
      "A privacy-first password check that estimates entropy and explains which requirements are missing.",
    problem:
      "Password meters often reward complexity while ignoring length, which is the strongest driver of resistance to guessing.",
    role: "Built the entropy estimator, requirement checks, and client-only interface.",
    features: [
      "Character-pool entropy estimate",
      "Length and character-class checks",
      "No network requests",
      "No password storage",
    ],
    technical:
      "The password never leaves the page. The estimate uses the size of the character pool actually used and the password length.",
    tech: ["React", "Security basics", "Client-side privacy"],
    demo: "password",
  },
  {
    id: "planner",
    title: "Academic Task Planner",
    type: "App",
    status: "Working tool",
    emoji: "📚",
    accent: "#eab308",
    summary:
      "A focused task list for students with priorities, completion tracking, and local persistence.",
    problem:
      "Students need a lightweight place to capture and prioritize coursework without another account.",
    role: "Built the task model, priority handling, progress counter, and local storage persistence.",
    features: [
      "Add tasks with High/Medium/Low priority",
      "Toggle completion and filter active work",
      "Progress summary",
      "Survives a page refresh via localStorage",
    ],
    technical:
      "Tasks are persisted locally and guarded against malformed stored data. No account or server is required.",
    tech: ["React", "localStorage", "Accessibility"],
    demo: "planner",
  },
];

export const promptEngineering = {
  title: "AI-assisted development, with review built in",
  summary:
    "I use AI tools to explore options, draft code, and remove repetitive work — then review, test, and adapt the result. The goal is faster delivery without handing over judgment.",
  specialties: [
    { name: "Claude", note: "Anthropic", icon: "C" },
    { name: "Gemini", note: "Google", icon: "G" },
    { name: "Microsoft Copilot", note: "Microsoft", icon: "M" },
  ],
  abilities: [
    "Structured prompting and context design",
    "AI-assisted prototyping and refactoring",
    "Iterative testing and prompt refinement",
    "Workflow automation",
    "Reviewing generated code before shipping",
    "Clear documentation of decisions",
  ],
};

export const experience = [
  {
    title: "Network Security Specialist",
    org: "Xbox Developer",
    kind: "Full-time",
    period: "May 2023 – Present",
    place: "Quezon City, Philippines · Remote",
    bullets: [
      "Apply network services and network defense practices to investigate and resolve technical issues.",
      "Work in a remote technical environment that requires clear documentation and communication.",
    ],
    skills: ["Network Services", "Network Defense"],
  },
  {
    title: "Technical Support Specialist",
    org: "ZOOSK LIMITED",
    kind: "Full-time",
    period: "Aug 2022 – Apr 2023",
    place: "Canada · Remote",
    bullets: [
      "Used Python and security intelligence to conduct technical investigations and resolve complex customer issues.",
      "Supported customers through troubleshooting and clear communication, with a focus on client satisfaction.",
    ],
    skills: ["Python", "Security Intelligence", "Technical Support"],
  },
  {
    title: "On-the-Job Training (OJT)",
    org: "Philippine National Police — San Juan City Police Station",
    kind: "Internship",
    period: "OJT certificate issued Nov 2023",
    place: "San Juan City, Philippines",
    bullets: [
      "Provided office IT support and assisted with day-to-day technical requests.",
    ],
    skills: ["Office IT Support"],
  },
  {
    title: "Information Technology Support Specialist",
    org: "City Government of Puerto Princesa",
    kind: "Internship",
    period: "Apr 2018 – Jun 2018",
    place: "Puerto Princesa, Philippines · On-site",
    bullets: [
      "Provided IT support and assisted with network services for local government operations.",
    ],
    skills: ["Network Services", "IT Support"],
  },
  {
    title: "Volunteer",
    org: "Parish Pastoral Council for Responsible Voting (PPCRV)",
    kind: "Volunteer",
    period: "May 2018 – Jun 2018",
    place: "Puerto Princesa, Philippines · On-site",
    bullets: ["Assisted with community voting operations and on-site coordination."],
    skills: ["Community Service", "Coordination"],
  },
];

export const education = [
  {
    school: "Institute of Applied Technology",
    program: "Microskills and Fundamentals — Network, Cloud and Cybersecurity",
    period: "Jan 2026 – Present",
    skills: ["Network Services", "Cloud Fundamentals", "Cybersecurity"],
  },
  {
    school: "San Sebastian College - Recoletos de Manila",
    program: "Bachelor of Science in Information Technology",
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

export const engineering = [
  {
    name: "PostgreSQL & Supabase",
    icon: "🗄️",
    text: "A relational schema for contact messages, orders, appointments, and study tasks, with constraints and Row Level Security policies.",
  },
  {
    name: "Cloudflare Worker",
    icon: "⚡",
    text: "An optional server-side form handler that validates posts and keeps the Supabase service-role key off the client.",
  },
  {
    name: "Vercel deployment",
    icon: "▲",
    text: "The production build is served from Vercel with a static SPA output and environment variables kept out of source control.",
  },
  {
    name: "GitHub Actions",
    icon: "✓",
    text: "CI runs linting, unit tests, and the production build on every push so the deployed site stays reproducible.",
  },
];
