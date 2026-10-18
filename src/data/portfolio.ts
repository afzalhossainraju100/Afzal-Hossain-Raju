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
    "MERN Stack Developer",
    "Frontend Developer",
    "UI/UX Designer",
  ],
  tagline:
    "Turning ideas into interactive, intelligent, and impactful software — that's what I do.",
  location: "Dhaka, Bangladesh",
  timezone: "Asia/Dhaka",
  status: "Open to new opportunities",
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
    "I'm currently completing my B.Sc. in Software Engineering at Daffodil International University, while working across the MERN stack.",
  ],
  facts: [
    { label: "Based in", value: "Dhaka, Bangladesh" },
    { label: "Studying", value: "B.Sc. in SWE · DIU" },
    { label: "Experience", value: "5+ years" },
    { label: "Focus", value: "MERN · UI/UX" },
  ],
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
    skills: ["HTML5", "CSS3", "JavaScript", "React", "Responsive Design"],
  },
  {
    title: "Backend",
    blurb: "APIs and data layers that stay calm under load.",
    skills: ["Node.js", "Express.js", "MongoDB", "REST APIs"],
  },
  {
    title: "Design",
    blurb: "From wireframe to clickable prototype.",
    skills: ["Figma", "Wireframing", "Prototyping", "UI/UX"],
  },
  {
    title: "Engineering",
    blurb: "The fundamentals underneath everything.",
    skills: ["C / C++", "Arduino", "Git & GitHub", "Problem Solving"],
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

export const experience: TimelineItem[] = [
  {
    period: "2024 — Present",
    title: "MERN Stack Developer",
    org: "DISA",
    place: "Bangladesh",
    description:
      "Working across the full stack — MongoDB, Express, React and Node.js — shipping features end to end.",
    tags: ["MongoDB", "Express", "React", "Node.js"],
    current: true,
  },
  {
    period: "2022 — 2024",
    title: "Backend Developer",
    org: "DISA",
    place: "Bangladesh",
    description:
      "Moved to the server side, building and maintaining the backend that powers the organization's applications.",
    tags: ["Node.js", "APIs", "Databases"],
  },
  {
    period: "2020 — 2022",
    title: "Frontend Developer",
    org: "DISA",
    place: "Bangladesh",
    description:
      "Started my professional journey crafting responsive user interfaces for the organization's web projects.",
    tags: ["HTML", "CSS", "JavaScript"],
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

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  description: string;
  highlights: string[];
  tags: string[];
  image?: { src: string; alt: string; fit: "cover" | "phone" };
  /** Rendered as generated artwork when there is no good photo. */
  art?: "nutrition";
  link?: { href: string; label: string };
  accent: string;
};

export const projects: Project[] = [
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
    link: {
      href: "https://www.figma.com/proto/4gk6IQDrIi2BXYM9a0IZgZ/Wireframing-in-Figma?page-id=0%3A1&node-id=242-1490&viewport=-1130%2C-701%2C0.29&t=8NNRc5MmKoRXL5QQ-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=108%3A341",
      label: "Open prototype",
    },
    accent: "#a78bfa",
  },
  {
    slug: "diet",
    title: "Smart Diet Suggestion",
    kicker: "Health-tech",
    description:
      "Suggests a healthy, balanced diet based on a person's calorie intake — turning nutrition guidelines into practical daily recommendations.",
    highlights: ["Calorie-based logic", "Balanced plate guidance", "Healthy habit focus"],
    tags: ["Health-tech", "Nutrition", "Algorithms"],
    art: "nutrition",
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
  { id: "skills", label: "Skills" },
  { id: "journey", label: "Journey" },
  { id: "work", label: "Work" },
  { id: "media", label: "Media" },
  { id: "contact", label: "Contact" },
] as const;

export const marqueeWords = [
  "React",
  "Node.js",
  "MongoDB",
  "Express",
  "JavaScript",
  "Figma",
  "Arduino",
  "UI/UX",
  "C++",
  "REST APIs",
];
