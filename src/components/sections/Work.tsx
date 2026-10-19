"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { projects, socials, type Project, type ProjectLink } from "@/data/portfolio";
import { useMediaQuery } from "@/lib/hooks";
import { ButtonLink } from "../ui/Button";
import { ArrowUpRight, BrandIcon, CheckIcon, DocIcon, LockIcon } from "../ui/Icons";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";
import { TiltCard } from "../ui/TiltCard";

const github = socials.find((s) => s.name === "GitHub")!;

function NutritionArt() {
  const segments = [
    { label: "Vegetables", value: 30, color: "#5eead4" },
    { label: "Grains", value: 30, color: "#a78bfa" },
    { label: "Protein", value: 20, color: "#f472b6" },
    { label: "Fruits", value: 20, color: "#22e4ff" },
  ];
  const r = 70;
  const C = 2 * Math.PI * r;
  const gap = 10;
  let offset = 0;

  return (
    <div className="absolute inset-0 flex items-center justify-center gap-8 bg-[radial-gradient(70%_70%_at_50%_50%,rgba(244,114,182,0.18),transparent)] p-6">
      <div className="relative aspect-square w-[min(62%,280px)]">
        <svg viewBox="0 0 200 200" className="absolute inset-0 -rotate-90" aria-hidden>
          <circle cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="20" />
          <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(255,255,255,0.12)" strokeDasharray="2 6" className="origin-center animate-spin-slow" />
          {segments.map((s, i) => {
            const len = (s.value / 100) * C - gap;
            const start = offset;
            offset += (s.value / 100) * C;
            return (
              <motion.circle
                key={s.label}
                cx="100"
                cy="100"
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth="20"
                strokeLinecap="round"
                strokeDashoffset={-start}
                initial={{ strokeDasharray: `0 ${C}` }}
                whileInView={{ strokeDasharray: `${len} ${C}` }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                style={{ filter: `drop-shadow(0 0 6px ${s.color}88)` }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-muted uppercase">Daily</p>
            <p className="font-display text-2xl font-bold">kcal</p>
            <p className="font-mono text-[10px] tracking-[0.25em] text-muted uppercase">balance</p>
          </div>
        </div>
      </div>
      <ul className="hidden space-y-3 sm:block">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-3 text-sm">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color, boxShadow: `0 0 10px ${s.color}` }} />
            <span className="text-fg/90">{s.label}</span>
            <span className="font-mono text-xs text-muted">{s.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectVisual({ project, index }: { project: Project; index: number }) {
  return (
    <div className="relative min-h-72 overflow-hidden sm:min-h-96 lg:min-h-0">
      {project.image?.fit === "cover" && (
        <>
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-tr from-ink/80 via-ink/20 to-transparent" />
        </>
      )}
      {project.image?.fit === "phone" && (
        <div
          className="absolute inset-0 grid place-items-center"
          style={{ background: `radial-gradient(60% 60% at 50% 55%, ${project.accent}40, transparent)` }}
        >
          <div className="absolute h-[70%] w-[50%] rounded-full blur-3xl" style={{ background: `${project.accent}33` }} />
          <Image
            src={project.image.src}
            alt={project.image.alt}
            width={385}
            height={810}
            sizes="260px"
            className="relative h-[86%] w-auto -rotate-6 rounded-[11%/5.5%] shadow-[0_30px_60px_-10px_rgba(0,0,0,0.8)] transition-transform duration-1000 ease-out-expo group-hover:rotate-0"
          />
        </div>
      )}
      {project.image?.fit === "browser" && (
        // In flow on small screens so the frame sets the height and clears the number and badge.
        <div
          className="relative grid h-full place-items-center px-5 pt-24 pb-10 sm:px-10 sm:pt-28 lg:absolute lg:inset-0 lg:px-8 lg:pt-20 lg:pb-8"
          style={{ background: `radial-gradient(70% 60% at 50% 55%, ${project.accent}33, transparent)` }}
        >
          <div className="absolute h-[55%] w-[70%] rounded-full blur-3xl" style={{ background: `${project.accent}26` }} />
          <figure className="relative w-full max-w-140 overflow-hidden rounded-xl border border-white/15 bg-ink-2 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] transition-transform duration-1000 ease-out-expo transform-[perspective(1400px)_rotateY(-9deg)_rotateX(4deg)] group-hover:transform-[perspective(1400px)_rotateY(0deg)_rotateX(0deg)]">
            <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/5 px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="mx-auto flex min-w-0 items-center gap-1.5 rounded-md bg-white/6 px-3 py-0.5 font-mono text-[10px] text-muted">
                <LockIcon className="h-2.5 w-2.5 shrink-0" />
                <span className="truncate">{project.image.frame}</span>
              </span>
              <span className="w-10" />
            </div>
            <Image
              src={project.image.src}
              alt={project.image.alt}
              width={1440}
              height={900}
              sizes="(min-width: 1024px) 560px, 100vw"
              className="block h-auto w-full"
            />
          </figure>
        </div>
      )}
      {project.art === "nutrition" && <NutritionArt />}

      <span
        aria-hidden
        className="text-outline absolute top-4 left-6 font-display text-7xl font-extrabold sm:text-8xl"
      >
        0{index + 1}
      </span>

      {project.live && (
        <span className="glass absolute top-6 right-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[10px] tracking-[0.22em] text-fg uppercase">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full" style={{ background: project.accent }} />
            <span className="relative h-2 w-2 rounded-full" style={{ background: project.accent }} />
          </span>
          Live
        </span>
      )}
    </div>
  );
}

const linkCopy: Record<ProjectLink["kind"], string> = {
  live: "live site",
  code: "source code on GitHub",
  docs: "documentation",
  design: "Figma prototype",
};

function ProjectLinks({ project }: { project: Project }) {
  if (!project.links?.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {project.links.map((link, i) => {
        const icon =
          link.kind === "code" ? (
            <BrandIcon name="GitHub" className="h-3.5 w-3.5" />
          ) : link.kind === "docs" ? (
            <DocIcon className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpRight className="h-4 w-4" />
          );
        return (
          <ButtonLink
            key={link.href}
            href={link.href}
            external
            size="sm"
            variant={i === 0 ? "primary" : "ghost"}
            icon={icon}
            label={`${project.title}: ${link.label}, ${linkCopy[link.kind]} (opens in a new tab)`}
          >
            {link.label}
          </ButtonLink>
        );
      })}
    </div>
  );
}

function ProjectCard({ project, index, total }: { project: Project; index: number; total: number }) {
  return (
    <Reveal className="w-full shrink-0 lg:w-[min(80vw,1080px)]">
      <TiltCard max={4} className="rounded-4xl">
        <article className="group glass grid overflow-hidden rounded-4xl lg:min-h-[min(72vh,600px)] lg:grid-cols-[1.2fr_1fr]">
          <ProjectVisual project={project} index={index} />
          <div className="flex flex-col p-7 sm:p-10 lg:p-9">
            <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.2em] uppercase">
              <span style={{ color: project.accent }}>{project.kicker}</span>
              <span className="text-muted">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-5 font-display text-3xl leading-tight font-bold text-balance sm:text-4xl">
              {project.title}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{project.description}</p>
            <ul className="mt-5 space-y-2">
              {project.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-sm text-fg/90">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: project.accent }} />
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-auto space-y-5 pt-7">
              <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
                {project.tags.map((t) => (
                  <li key={t} className="rounded-full border border-line px-2.5 py-1 text-[11px] text-fg/80">
                    {t}
                  </li>
                ))}
              </ul>
              <ProjectLinks project={project} />
            </div>
          </div>
        </article>
      </TiltCard>
    </Reveal>
  );
}

function MoreCard() {
  return (
    <Reveal className="w-full shrink-0 lg:w-[min(32vw,400px)]">
      <a
        href={github.href}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="Open"
        className="group glass relative flex aspect-4/3 flex-col justify-between overflow-hidden rounded-4xl p-8 transition-colors duration-500 hover:border-cyan/40 lg:aspect-auto lg:h-[min(72vh,600px)]"
      >
        <div className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-violet/20 blur-3xl transition-transform duration-1000 group-hover:scale-150" />
        <BrandIcon name="GitHub" className="relative h-10 w-10" />
        <div className="relative">
          <p className="font-mono text-[11px] tracking-[0.25em] text-muted uppercase">100+ public repositories</p>
          <p className="mt-3 font-display text-4xl leading-tight font-bold">
            Explore everything on <span className="text-gradient">GitHub</span>
          </p>
          <span className="mt-8 inline-grid h-14 w-14 place-items-center rounded-full bg-fg text-ink transition-transform duration-500 ease-out-expo group-hover:rotate-45">
            <ArrowUpRight className="h-6 w-6" />
          </span>
        </div>
      </a>
    </Reveal>
  );
}

export function Work() {
  const desktop = useMediaQuery("(min-width: 1024px)");
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!desktop || !el) return;
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [desktop]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (v) => -v * distance);
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section
      ref={section}
      id="work"
      data-scene="work"
      className="relative"
      style={desktop ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div
        className={
          desktop ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden" : "px-5 py-28 sm:px-10 sm:py-40"
        }
      >
        <motion.div
          ref={track}
          style={desktop ? { x } : undefined}
          className={
            desktop ? "flex w-max items-center gap-10 px-[6vw]" : "mx-auto flex max-w-3xl flex-col gap-10"
          }
        >
          <div className={desktop ? "w-[min(34vw,480px)] shrink-0" : ""}>
            <SectionHeading
              index="02"
              eyebrow="Selected work"
              title="Things I've built & designed."
              highlight={["built", "designed."]}
              description="Full-stack apps on the web, a robot that moves, and ideas that help people live better — with live demos and source code wherever I can share them."
            />
            {desktop && (
              <Reveal delay={0.3} className="mt-12 flex items-center gap-4 font-mono text-[11px] tracking-[0.25em] text-muted uppercase">
                <span className="h-px w-16 bg-linear-to-r from-cyan to-transparent" />
                Keep scrolling
              </Reveal>
            )}
          </div>

          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} total={projects.length} />
          ))}
          <MoreCard />
        </motion.div>

        {desktop && (
          <div className="absolute inset-x-[6vw] bottom-10 h-px bg-line">
            <motion.div className="h-full origin-left bg-linear-to-r from-cyan via-violet to-pink" style={{ scaleX: bar }} />
          </div>
        )}
      </div>
    </section>
  );
}
