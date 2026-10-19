/**
 * Every piece of text, link and image on the site lives here.
 * Edit this file to update the portfolio — no component changes needed.
 */

export const profile = {
  name: "Afzal Hossain Raju",
  firstName: "Afzal",
  shortName: "Raju",
  initials: "AR",
  roles: [
    "Software Engineer",
    "Full-Stack Developer",
    "MERN Stack Developer",
    "UI/UX Designer",
  ],
  tagline:
    "Turning ideas into interactive, intelligent, and impactful software — that's what I do.",
  location: "Dhaka, Bangladesh",
  timezone: "Asia/Dhaka",
  status: "Open to new opportunities",
  /** Small "what's new" pill in the hero. */
  announcement: { label: "New", text: "ZapShift & Travel Guru are live", href: "#work" },
  photos: {
    // Transparent cutout; the portrait card paints a glow behind it.
    professional: "/images/profile-suit.png",
    personal: "/images/imageraju1.jpg",
  },
};

export const about = {
  intro:
    "Hi, I'm Afzal Hossain Raju — a passionate and results-driven Software Developer with a strong focus on building clean, efficient, and scalable solutions.",
  body: [
    "With a deep understanding of both frontend and backend technologies, I help individuals and businesses bring their digital ideas to life.",
    "I'm currently completing my B.Sc. in Software Engineering at Daffodil International University and building full-stack MERN applications — most recently ZapShift, a parcel delivery platform with role-based dashboards, live tracking and Stripe payments.",
  ],
  facts: [
    { label: "Based in", value: "Dhaka, Bangladesh" },
    { label: "Studying", value: "B.Sc. in SWE · DIU" },
    { label: "On GitHub", value: "100+ public repos" },
    { label: "Focus", value: "MERN · UI/UX" },
  ],
  /** Floating badge on the portrait card. */
  latest: { label: "Latest build", value: "ZapShift" },
  beyondCode: [
    "Robotics & Arduino builds",
    "Designing in Figma",
    "Health-tech ideas",
    "Sharing what I learn",
  ],
};

export type SkillGroup = {
  title: string;
  blurb: string;
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend",
    blurb: "Pixel-careful interfaces that feel fast and alive.",
    skills: ["React", "JavaScript", "Tailwind CSS", "TanStack Query", "React Router", "HTML5 & CSS3"],
  },
  {
    title: "Backend",
    blurb: "APIs and data layers that stay calm under load.",
    skills: ["Node.js", "Express.js", "MongoDB", "REST APIs", "Firebase Auth", "Stripe"],
  },
  {
    title: "Design",
    blurb: "From wireframe to clickable prototype.",
    skills: ["Figma", "Wireframing", "Prototyping", "Responsive Design"],
  },
  {
    title: "Engineering",
    blurb: "The fundamentals underneath everything.",
    skills: ["C / C++", "Python", "Arduino", "Git & GitHub", "Vercel", "Problem Solving"],
  },
];

export type TimelineItem = {
  period: string;
  title: string;
  org: string;
  place?: string;
  description: string;
  tags?: string[];
  current?: boolean;
};

/** What I've built and learned, newest first. Projects, not job titles. */
export const milestones: TimelineItem[] = [
  {
    period: "2026",
    title: "Shipped ZapShift",
    org: "Full-stack parcel delivery platform",
    description:
      "Built and deployed a MERN app with layered customer, rider and admin roles, Stripe checkout, public parcel tracking and an analytics dashboard.",
    tags: ["React", "Express", "MongoDB", "Stripe"],
    current: true,
  },
  {
    period: "2026",
    title: "Shipped Travel Guru",
    org: "Full-stack tour booking platform",
    description:
      "Tour packages, custom tour quotes, online payments and an AI trip assistant on React, Express and MongoDB, documented end to end with an SRS, progress report and final presentation.",
    tags: ["React", "Firebase", "Express", "MongoDB"],
  },
  {
    period: "2025 — 2026",
    title: "Went full-stack",
    org: "Hands-on MERN practice",
    description:
      "Moved from HTML and CSS to JavaScript, React, Node.js and MongoDB by building, with 100+ public repositories of apps, APIs and problem-solving along the way.",
    tags: ["JavaScript", "React", "Node.js", "MongoDB"],
  },
  {
    period: "Foundations",
    title: "Robotics, C & product design",
    org: "Early projects",
    description:
      "An Arduino robot that follows people and dodges obstacles, a calorie-based diet planner in C, and a travel app prototyped end to end in Figma.",
    tags: ["C / C++", "Arduino", "Figma"],
  },
];

export const education: TimelineItem[] = [
  {
    period: "Expected 2026",
    title: "B.Sc. in Software Engineering",
    org: "Daffodil International University",
    place: "Dhaka",
    description:
      "Studying software engineering in depth — from algorithms and system design to building production-grade software.",
    current: true,
  },
  {
    period: "2020",
    title: "Higher Secondary Certificate (HSC)",
    org: "Bangladesh Noubahini School & College",
    place: "Khulna",
    description: "Completed higher secondary education.",
  },
  {
    period: "2018",
    title: "Secondary School Certificate (SSC)",
    org: "Sufalakati Secondary School",
    place: "Keshabpur, Jashore",
    description: "Completed secondary education.",
  },
];

export type ProjectLink = {
  href: string;
  label: string;
  kind: "live" | "code" | "docs" | "design";
};

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  description: string;
  highlights: string[];
  tags: string[];
  /** "browser" frames a website screenshot in a browser window; `frame` is the text in its address bar. */
  image?: { src: string; alt: string; fit: "cover" | "phone" | "browser"; frame?: string };
  /** Rendered as generated artwork when there is no good photo. */
  art?: "nutrition";
  /** The first link is the primary button. */
  links?: ProjectLink[];
  /** Shows a pulsing "Live" badge on the visual. */
  live?: boolean;
  accent: string;
};

export const projects: Project[] = [
  {
    slug: "zapshift",
    title: "ZapShift",
    kicker: "Full-stack · Logistics",
    description:
      "Door-to-door parcel delivery for Bangladesh. Customers book and pay, nearby riders accept and deliver, and admins run the whole operation from one dashboard.",
    highlights: [
      "Instant pricing with Stripe checkout",
      "Public parcel tracking on a live timeline",
      "Customer, rider and admin dashboards",
      "District-based rider dispatch",
    ],
    tags: ["React 19", "Express 5", "MongoDB", "Firebase Auth", "Stripe", "TanStack Query", "Tailwind CSS"],
    image: {
      src: "/images/projects/zapshift.webp",
      alt: "ZapShift home page: “We make sure your parcel arrives on time” with a parcel tracking box",
      fit: "browser",
      frame: "zapshift-app.vercel.app",
    },
    links: [
      { href: "https://zapshift-app.vercel.app", label: "Live site", kind: "live" },
      { href: "https://github.com/afzalhossainraju100/ZAP-SHIFT-CLIENT", label: "Client", kind: "code" },
      { href: "https://github.com/afzalhossainraju100/Zap-Shift-Server", label: "API", kind: "code" },
    ],
    live: true,
    accent: "#5eead4",
  },
  {
    slug: "travel-guru",
    title: "Travel Guru",
    kicker: "Full-stack · Travel-tech",
    description:
      "A tour booking platform for exploring Bangladesh. Travellers book a ready-made package or request a custom tour with a full cost quote, pay online, and travel with a local guide.",
    highlights: [
      "Ready-made packages or custom tour quotes",
      "Stripe card payments, or cash / bKash",
      "Booking approval flow with a traveller dashboard",
      "AI trip assistant for packages and bookings",
    ],
    tags: ["React 19", "React Router", "Firebase Auth", "Express 5", "MongoDB", "Stripe", "Tailwind CSS"],
    image: {
      src: "/images/projects/travel-guru-live.webp",
      alt: "Travel Guru home page: “Your journey, perfectly planned” with a destination search",
      fit: "browser",
      frame: "travelguru-app.vercel.app",
    },
    links: [
      { href: "https://travelguru-app.vercel.app", label: "Live site", kind: "live" },
      { href: "https://github.com/afzalhossainraju100/Travel-Guru", label: "Client", kind: "code" },
      { href: "https://github.com/afzalhossainraju100/Travel-Guru-Server", label: "Server", kind: "code" },
      { href: "https://github.com/afzalhossainraju100/TravelGuruDocumentation", label: "Docs", kind: "docs" },
    ],
    live: true,
    accent: "#f9a51a",
  },
  {
    slug: "robot",
    title: "Multifunctional Robot",
    kicker: "Robotics · Hardware",
    description:
      "An Arduino-powered 4WD robot that follows a person, steers around obstacles, and can be driven from a smartphone over Bluetooth.",
    highlights: ["Human following", "Obstacle avoidance", "Bluetooth smartphone control"],
    tags: ["Arduino", "C++", "Ultrasonic sensors", "Bluetooth"],
    image: { src: "/images/robo.jpg", alt: "The multifunctional Arduino robot with ultrasonic sensors and yellow wheels", fit: "cover" },
    accent: "#22e4ff",
  },
  {
    slug: "travel",
    title: "Tourism & Travel Planner",
    kicker: "Product Design · Figma",
    description:
      "A travel planner app designed end to end in Figma — onboarding, sign-in, curated travel packages and a build-your-own trip flow, wired up as a clickable prototype.",
    highlights: ["Full user flow", "Interactive prototype", "Wireframe to hi-fi"],
    tags: ["Figma", "UI/UX", "Prototyping"],
    image: { src: "/images/travel.png", alt: "Home screen of the Tourism and Travel Planner app design", fit: "phone" },
    links: [
      {
        href: "https://www.figma.com/proto/4gk6IQDrIi2BXYM9a0IZgZ/Wireframing-in-Figma?page-id=0%3A1&node-id=242-1490&viewport=-1130%2C-701%2C0.29&t=8NNRc5MmKoRXL5QQ-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=108%3A341",
        label: "Open prototype",
        kind: "design",
      },
    ],
    accent: "#a78bfa",
  },
  {
    slug: "diet",
    title: "Smart Diet Suggestion",
    kicker: "Health-tech · C",
    description:
      "Suggests a healthy, balanced diet based on a person's calorie intake — turning nutrition guidelines into practical daily recommendations. Built in C as a software engineering course project, with an SRS and presentation.",
    highlights: ["Calorie-based logic", "Balanced plate guidance", "Healthy habit focus"],
    tags: ["C", "Algorithms", "Health-tech", "SRS"],
    art: "nutrition",
    links: [
      {
        href: "https://github.com/afzalhossainraju100/Project-1-Healthy-Food-Suggetion-Based-On-Calories-in-C",
        label: "Code & docs",
        kind: "code",
      },
    ],
    accent: "#f472b6",
  },
];

export type Post = {
  title: string;
  description: string;
  kind: "video" | "article";
  href: string;
  youtubeId?: string;
  image?: string;
  accent: string;
};

export const posts: Post[] = [
  {
    title: "Video Resume",
    description: "All about me — who I am, what I do, and where I'm headed. Press play!",
    kind: "video",
    href: "https://www.youtube.com/watch?v=FHgKyWpL__k",
    youtubeId: "FHgKyWpL__k",
    accent: "#22e4ff",
  },
  {
    title: "Frontend Developer Roadmap",
    description: "The path I recommend for becoming a frontend developer, step by step.",
    kind: "article",
    href: "https://roadmap.sh/frontend",
    image: "/images/webrodemap.jpeg",
    accent: "#a78bfa",
  },
  {
    title: "Backend Developer Roadmap",
    description: "Servers, databases and APIs — a map of the backend landscape.",
    kind: "article",
    href: "https://roadmap.sh/backend",
    image: "/images/webroadmap.png",
    accent: "#f472b6",
  },
];

export const contact = {
  heading: "Let's build something amazing together.",
  address: "G-Block, Mirpur-1, Dhaka",
  phone: "+880 1516 503901",
  phoneHref: "tel:+8801516503901",
  email: "raju23105341031@diu.edu.bd",
};

export type Social = {
  name: "GitHub" | "LinkedIn" | "Facebook" | "X" | "Instagram";
  href: string;
  handle: string;
};

export const socials: Social[] = [
  { name: "GitHub", href: "https://github.com/afzalhossainraju100", handle: "afzalhossainraju100" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/afzal-hossain-raju/", handle: "afzal-hossain-raju" },
  { name: "Facebook", href: "https://www.facebook.com/mmafzal.raju", handle: "mmafzal.raju" },
  { name: "X", href: "https://x.com/AfzalHossa7558", handle: "@AfzalHossa7558" },
  { name: "Instagram", href: "https://www.instagram.com/m.m.a.h.raju/", handle: "m.m.a.h.raju" },
];

export const navLinks = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "journey", label: "Journey" },
  { id: "media", label: "Media" },
  { id: "contact", label: "Contact" },
] as const;

export const marqueeWords = [
  "React",
  "Node.js",
  "MongoDB",
  "Express",
  "Tailwind CSS",
  "Firebase",
  "Stripe",
  "JavaScript",
  "Figma",
  "Arduino",
  "C++",
  "REST APIs",
];
