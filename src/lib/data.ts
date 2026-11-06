import {
  Briefcase,
  Cpu,
  FolderKanban,
  House,
  Send,
  UserRound,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Site                                                                */
/* ------------------------------------------------------------------ */

export const site = {
  name: "Mike Julius Coloma",
  shortName: "MJC",
  role: "Web Developer",
  tagline:
    "Laravel & React.js developer building fast, interactive web applications.",
  description:
    "Portfolio of Mike Julius Coloma — Web Developer specializing in Laravel, React.js, Inertia.js, PHP, JavaScript, and Tailwind CSS. Based in Orani, Bataan, Philippines.",
  email: "mjbcoloma@gmail.com",
  phone: { display: "+63 976 365 0797", href: "tel:+639763650797" },
  location: "Baguio, Benguet, Philippines",
  github: "https://github.com/clmJuls",
  linkedin: "https://linkedin.com/in/mike-julius",
  formAction: "https://formsubmit.co/7a2266e20585feb9d879a5756f3e175a",
} as const;

export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

/* ------------------------------------------------------------------ */
/* Navigation (bubble nav)                                             */
/* ------------------------------------------------------------------ */

export type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  size: "md" | "lg";
  /** Resting spot in the hero, as a fraction of the viewport (desktop). */
  anchor: { x: number; y: number };
};

export const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: House, size: "md", anchor: { x: 0.63, y: 0.3 } },
  { id: "about", label: "About", icon: UserRound, size: "md", anchor: { x: 0.69, y: 0.57 } },
  { id: "experience", label: "Experience", icon: Briefcase, size: "lg", anchor: { x: 0.81, y: 0.22 } },
  { id: "skills", label: "Skills", icon: Cpu, size: "lg", anchor: { x: 0.83, y: 0.74 } },
  { id: "projects", label: "Projects", icon: FolderKanban, size: "md", anchor: { x: 0.91, y: 0.48 } },
  { id: "contact", label: "Contact", icon: Send, size: "md", anchor: { x: 0.65, y: 0.83 } },
];

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */

export const aboutStatement =
  "I build responsive web applications with Laravel, React.js and Inertia.js — integrating APIs, shipping secure, scalable back-ends and sweating the small interactions. Gaming sharpened how I solve problems: read the map, adapt fast, and treat every bug like a boss fight.";

export const quickFacts = [
  { label: "Location", value: "Orani, Bataan" },
  { label: "Education", value: "BS IT — Web Tech" },
  { label: "Experience", value: "2+ Years" },
  { label: "Gamer Tag", value: "Kaz" },
] as const;

/* ------------------------------------------------------------------ */
/* Experience                                                          */
/* ------------------------------------------------------------------ */

export const experiences = [
  {
    company: "Eversun Software Philippines Corporation",
    role: "Web Developer",
    location: "Davao City",
    period: "Dec 2024 — October 2026",
    current: false,
    stack: ["Laravel", "React.js", "Inertia.js", "TailwindCSS", "MySQL"],
    points: [
      "Develop and maintain web applications using Laravel (MVC), React.js, Inertia.js, JavaScript, PHP and TailwindCSS.",
      "Built Domain Lifecycle Management, System Email History, Domain History Tracking and Client Activity Logging features.",
      "Implemented Laravel Job Queues for background work like email processing and system notifications.",
      "Improved performance through database indexing, query optimization and efficient data handling.",
      "Use logging and structured error handling to monitor behavior and speed up debugging.",
      "Keep the codebase scalable with clean-code principles and modular architecture.",
    ],
  },
  {
    company: "Bitshares Labs INC.",
    role: "Web Developer",
    location: "Baguio City",
    period: "Jun — Aug 2024",
    current: false,
    stack: ["HTML/CSS", "JavaScript", "PHP", "MySQL"],
    points: [
      "Developed and enhanced internal tracking systems for activities, records and environment-related data.",
      "Shipped UI improvements and responsive layouts across screen sizes with HTML, CSS and JavaScript.",
      "Helped build and maintain application features with a focus on usability and performance.",
    ],
  },
] as const;

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

export const skillGroups = [
  {
    title: "Frontend",
    color: "#06B6D4",
    blurb: "Interfaces that feel fast and stay accessible.",
    skills: ["React.js", "Vue.js", "TailwindCSS", "shadcn/ui", "Bootstrap", "CSS / SASS", "Foundation"],
  },
  {
    title: "Backend",
    color: "#22C55E",
    blurb: "Secure, scalable Laravel back-ends.",
    skills: ["Laravel", "PHP", "Inertia.js", "REST APIs", "Auth", "Job Queues"],
  },
  {
    title: "Data & Tools",
    color: "#EAB308",
    blurb: "Solid data layers and a tidy workflow.",
    skills: ["MySQL", "PostgreSQL", "Git", "JavaScript", "HTML / CSS"],
  },
  {
    title: "Workspace",
    color: "#A78BFA",
    blurb: "Remote-ready and team-first.",
    skills: ["Slack", "Teams", "Zoom", "Google Workspace", "Problem Solving", "Collaboration"],
  },
] as const;

export const certifications = [
  "Computer System Servicing NC II",
  "BLINC Technologies Internship Program",
] as const;

export const gamerProfile = [
  { label: "Gamer Tag", value: "Kaz" },
  { label: "Role", value: "Support / Flex" },
  { label: "Playstyle", value: "Strategic" },
  { label: "Achievement", value: "Problem Solver" },
] as const;

/** Slugs for the 3D icon cloud (simple-icons). */
export const iconCloudSlugs = [
  "typescript", "javascript", "react", "vuedotjs", "php", "laravel", "mysql",
  "postgresql", "html5", "css", "tailwindcss", "git", "github", "vercel",
  "nextdotjs", "npm", "vite", "bootstrap", "docker", "figma",
];

export const marqueeTech = [
  "Laravel", "React.js", "Inertia.js", "PHP", "JavaScript", "TypeScript",
  "TailwindCSS", "Vue.js", "MySQL", "PostgreSQL", "Next.js", "Git",
  "REST APIs", "Job Queues", "Vite", "Docker", "Figma",
];

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export type Project = {
  title: string;
  company: string;
  year?: string;
  description: string;
  tags: string[];
  image?: string;
  /** Live or repo URL. Leave undefined for private/client work. */
  href?: string;
  /** Hue used for the generated cover when there's no screenshot. */
  hue: number;
};

export const projects: Project[] = [
  {
    title: "Domain Lifecycle Management",
    company: "Eversun Software",
    description:
      "A domain lifecycle system with tracking, history logging and client activity monitoring, built on Laravel, React.js and Inertia.js.",
    tags: ["Laravel", "React", "Inertia.js", "TailwindCSS", "MySQL"],
    hue: 152,
  },
  {
    title: "Strange Domains Platform",
    company: "Current Work",
    description:
      "Domain management and unusual-domain tracking with advanced search and an analytics dashboard.",
    image: "/project2.png",
    tags: ["PHP", "Laravel", "MySQL"],
    hue: 190,
  },
  {
    title: "System Email History",
    company: "Eversun Software",
    description:
      "Email history tracking with search, filtering and detailed audit logs for every system communication.",
    tags: ["PHP", "Laravel", "Job Queues", "JavaScript"],
    hue: 265,
  },
  {
    title: "Inventory Management System",
    company: "Enterprise Solution",
    description:
      "Real-time stock tracking, automated reordering, barcode scanning and detailed reporting.",
    image: "/project3.png",
    tags: ["PHP", "JavaScript", "MySQL"],
    hue: 40,
  },
  {
    title: "Client Activity Logger",
    company: "Eversun Software",
    description:
      "Comprehensive client activity logging with real-time monitoring, error handling and performance tuning.",
    tags: ["Laravel", "React", "Indexing", "Query Optimization"],
    hue: 172,
  },
  {
    title: "Cosplayer Portfolio Blog",
    company: "Personal Project",
    description:
      "A dynamic blog for a cosplayer featuring portfolio showcases, event updates and community engagement.",
    image: "/project1.png",
    tags: ["HTML/CSS", "JavaScript", "PHP", "Responsive"],
    hue: 330,
  },
  {
    title: "Internal Tracking System",
    company: "Bitshares Labs",
    description:
      "Internal systems for monitoring activities, records and environment-related data with a responsive UI.",
    tags: ["HTML/CSS", "JavaScript", "PHP", "MySQL"],
    hue: 210,
  },
];
