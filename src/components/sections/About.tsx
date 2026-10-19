"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useState, type ReactNode } from "react";
import { about, profile } from "@/data/portfolio";
import { ButtonLink } from "../ui/Button";
import { ArrowUpRight, FlipIcon, SparkIcon } from "../ui/Icons";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";
import { TiltCard } from "../ui/TiltCard";

type Mode = "professional" | "personal";

const faces: Record<Mode, { src: string; alt: string; caption: string; sub: string; position: string }> = {
  professional: {
    src: profile.photos.professional,
    alt: `${profile.name} in a navy suit and striped tie, smiling at the camera`,
    caption: "Professional",
    sub: profile.roles[0],
    position: "50% 0%",
  },
  personal: {
    src: profile.photos.personal,
    alt: `${profile.name} in a casual t-shirt with earphones, looking into the distance`,
    caption: "Personal",
    sub: "Off the clock",
    position: "50% 18%",
  },
};

function Face({ mode, back }: { mode: Mode; back?: boolean }) {
  const f = faces[mode];
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-4xl border border-white/10 bg-ink-2 backface-hidden"
      style={back ? { transform: "rotateY(180deg)" } : undefined}
    >
      {/* Shows through transparent cutout photos; opaque photos simply cover it. */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_26%,rgba(139,92,246,0.45),transparent_70%),radial-gradient(90%_55%_at_50%_100%,rgba(34,228,255,0.18),transparent_70%)]" />
      <Image
        src={f.src}
        alt={f.alt}
        fill
        sizes="(min-width: 1024px) 440px, 90vw"
        className="object-cover"
        style={{ objectPosition: f.position }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_40%,rgba(139,92,246,0.25))] mix-blend-screen" />
      <div className="absolute inset-x-5 bottom-5 flex items-end justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-cyan uppercase">{f.caption} mode</p>
          <p className="mt-1 font-display text-2xl font-bold">{f.sub}</p>
        </div>
        <span className="glass grid h-10 w-10 place-items-center rounded-full">
          <FlipIcon className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

function Badge({
  depth,
  delay,
  className,
  children,
}: {
  depth: number;
  delay?: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <div aria-hidden className={`pointer-events-none absolute ${className}`} style={{ transform: `translateZ(${depth}px)` }}>
      <div className="glass animate-float rounded-2xl px-4 py-3" style={{ animationDelay: delay }}>
        {children}
      </div>
    </div>
  );
}

function PortraitCard() {
  const [mode, setMode] = useState<Mode>("professional");
  const flip = () => setMode((m) => (m === "professional" ? "personal" : "professional"));

  return (
    <div className="mx-auto w-full max-w-110">
      <TiltCard max={8} className="rounded-4xl" data-cursor="Flip">
        {/* Glow halo */}
        <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-linear-to-br from-cyan/30 via-violet/25 to-pink/30 opacity-70 blur-3xl" />
        <button
          type="button"
          onClick={flip}
          aria-label={`Showing ${mode} photo. Flip to ${mode === "professional" ? "personal" : "professional"} photo`}
          className="relative block aspect-4/5 w-full perspective-[1600px]"
        >
          <motion.div
            className="absolute inset-0 transform-3d"
            animate={{ rotateY: mode === "professional" ? 0 : 180 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Face mode="professional" />
            <Face mode="personal" back />
          </motion.div>
        </button>

        {/* Badges sit in front of the card in 3D space, so they parallax as it tilts */}
        <Badge depth={70} className="top-8 left-3 sm:-left-10">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <span className="h-2 w-2 rounded-full bg-cyan shadow-[0_0_10px_var(--color-cyan)]" /> MERN Stack
          </span>
        </Badge>
        <Badge depth={90} delay="-2s" className="bottom-32 left-3 sm:-left-10">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <SparkIcon className="h-4 w-4 text-pink" /> UI/UX · Figma
          </span>
        </Badge>
        <Badge depth={60} delay="-4s" className="-top-6 right-3 sm:-right-8">
          <p className="font-mono text-[10px] tracking-[0.25em] text-muted uppercase">{about.latest.label}</p>
          <p className="text-gradient font-display text-2xl font-bold">{about.latest.value}</p>
        </Badge>
      </TiltCard>

      <div role="group" aria-label="Photo mode" className="glass relative mx-auto mt-14 flex w-max rounded-full p-1">
        {(["professional", "personal"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={`relative rounded-full px-5 py-2 text-sm font-medium capitalize transition-colors duration-300 ${
              mode === m ? "text-ink" : "text-muted hover:text-fg"
            }`}
          >
            {mode === m && (
              <motion.span
                layoutId="mode-pill"
                className="absolute inset-0 rounded-full bg-fg"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">{m}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function About() {
  return (
    <section id="about" data-scene="about" className="relative px-5 py-28 sm:px-10 sm:py-40">
      <div className="mx-auto grid max-w-7xl items-center gap-20 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <PortraitCard />
        </Reveal>

        <div className="lg:col-span-7">
          <SectionHeading
            index="01"
            eyebrow="About me"
            title="Engineer by training, creator at heart."
            highlight={["creator"]}
          />
          <Reveal delay={0.1} className="mt-8 text-xl leading-relaxed text-fg sm:text-2xl">
            {about.intro}
          </Reveal>
          {about.body.map((p, i) => (
            <Reveal key={i} delay={0.15 + i * 0.05} className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
              {p}
            </Reveal>
          ))}

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {about.facts.map((fact, i) => (
              <Reveal key={fact.label} delay={0.1 + i * 0.07} className="glass rounded-2xl p-4">
                <p className="font-mono text-[10px] tracking-[0.22em] text-muted uppercase">{fact.label}</p>
                <p className="mt-2 text-sm font-semibold sm:text-[15px]">{fact.value}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-10">
            <p className="font-mono text-[11px] tracking-[0.25em] text-cyan uppercase">Beyond the code</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {about.beyondCode.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-line px-4 py-2 text-sm text-fg/90 transition-colors duration-300 hover:border-violet/60 hover:bg-violet/10"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.25} className="mt-12">
            <ButtonLink href="#contact" icon={<ArrowUpRight className="h-4 w-4" />}>
              Get in touch
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
