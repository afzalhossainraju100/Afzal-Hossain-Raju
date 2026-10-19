"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { profile, socials } from "@/data/portfolio";
import { useLocalTime } from "@/lib/hooks";
import { useIntroDone } from "@/lib/intro";
import { ButtonLink } from "../ui/Button";
import { ArrowUpRight, BrandIcon } from "../ui/Icons";
import { Magnetic } from "../ui/Magnetic";

const ease = [0.16, 1, 0.3, 1] as const;

/** Letter-by-letter rise; words stay intact so the name can wrap on small screens. */
function Letters({ text, delay, className }: { text: string; delay: number; className?: string }) {
  const letter = {
    hidden: { y: "115%", rotateZ: 8 },
    show: { y: "0%", rotateZ: 0, transition: { duration: 1.1, ease } },
  };
  return (
    <motion.span
      aria-hidden
      className={`block overflow-hidden pb-[0.08em] ${className ?? ""}`}
      variants={{ show: { transition: { staggerChildren: 0.035, delayChildren: delay } } }}
    >
      {text.split(" ").map((word, w) => (
        <Fragment key={w}>
          {w > 0 && " "}
          <span className="inline-block whitespace-nowrap">
            {word.split("").map((ch, i) => (
              <motion.span key={i} className="inline-block will-change-transform" variants={letter}>
                {ch}
              </motion.span>
            ))}
          </span>
        </Fragment>
      ))}
    </motion.span>
  );
}

function RoleRotator() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % profile.roles.length), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="relative inline-flex h-[1.3em] overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={profile.roles[index]}
          className="text-gradient inline-block font-semibold whitespace-nowrap"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          {profile.roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Hero() {
  const intro = useIntroDone();
  const time = useLocalTime(profile.timezone);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const state = intro ? "show" : "hidden";

  return (
    <section
      ref={ref}
      id="home"
      data-scene="hero"
      className="relative flex min-h-svh flex-col justify-center px-5 pt-28 pb-44 sm:px-10 sm:pb-32"
    >
      <motion.div style={{ y, opacity }} className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={intro ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="mb-8 flex flex-wrap items-center gap-3"
        >
          <span className="glass inline-flex items-center gap-2.5 rounded-full py-1.5 pr-4 pl-2 text-xs text-muted sm:text-sm">
            <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-mint/15">
              <span className="absolute h-2 w-2 animate-ping-slow rounded-full bg-mint" />
              <span className="relative h-2 w-2 rounded-full bg-mint" />
            </span>
            {profile.status}
          </span>
          <a
            href={profile.announcement.href}
            className="group inline-flex items-center gap-2 rounded-full border border-line py-1.5 pr-3.5 pl-1.5 text-xs text-fg/90 transition-colors duration-300 hover:border-cyan/50 hover:text-fg sm:text-sm"
          >
            <span className="rounded-full bg-linear-to-r from-cyan to-violet px-2 py-0.5 font-mono text-[10px] font-medium tracking-[0.15em] text-ink uppercase">
              {profile.announcement.label}
            </span>
            {profile.announcement.text}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>

        <motion.h1
          initial="hidden"
          animate={state}
          aria-label={profile.name}
          className="font-display text-[clamp(3rem,7.6vw,7.25rem)] leading-[0.88] font-extrabold tracking-[-0.035em]"
        >
          <Letters text="Afzal Hossain" delay={0.05} />
          {/* One span, not per-letter: background-clip:text can't paint through separately transformed children. */}
          <span aria-hidden className="block overflow-hidden pb-[0.08em]">
            <motion.span
              className="text-gradient inline-block will-change-transform"
              variants={{
                hidden: { y: "115%", rotateZ: 6 },
                show: { y: "0%", rotateZ: 0, transition: { duration: 1.2, delay: 0.45, ease } },
              }}
            >
              Raju.
            </motion.span>
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={intro ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease, delay: 0.7 }}
          className="mt-8 max-w-xl"
        >
          <p className="text-xl text-fg sm:text-2xl">
            I&apos;m a <RoleRotator />
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{profile.tagline}</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <ButtonLink href="#work" icon={<ArrowUpRight className="h-4 w-4" />}>
              Explore my work
            </ButtonLink>
            <ButtonLink href="#contact" variant="ghost">
              Let&apos;s talk
            </ButtonLink>
          </div>
        </motion.div>
      </motion.div>

      {/* Invitation to play with the particles */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={intro ? { opacity: 1 } : {}}
        transition={{ delay: 1.6, duration: 1 }}
        className="pointer-events-none absolute top-1/2 right-10 hidden max-w-40 -translate-y-1/2 text-right font-mono text-[10px] leading-relaxed tracking-[0.2em] text-muted/70 uppercase xl:block"
      >
        Move your cursor through the galaxy · click for a shockwave
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={intro ? { opacity: 1 } : {}}
        transition={{ delay: 1.1, duration: 1 }}
        className="absolute inset-x-0 bottom-0 px-5 pb-8 sm:px-10"
      >
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="font-mono text-[11px] leading-relaxed tracking-[0.18em] text-muted uppercase">
            <p>Based in {profile.location}</p>
            <p>
              Local time <span className="text-fg tabular-nums">{time || "--:--"}</span> · GMT+6
            </p>
          </div>

          <a
            href="#about"
            aria-label="Scroll to About"
            className="absolute left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-muted uppercase md:flex"
          >
            <span className="flex h-11 w-7 justify-center rounded-full border border-line pt-2">
              <span className="h-2 w-1 animate-scroll-dot rounded-full bg-cyan" />
            </span>
            Scroll
          </a>

          <ul className="flex gap-2">
            {socials.map((s) => (
              <li key={s.name}>
                <Magnetic strength={0.4}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.name} — ${s.handle}`}
                    className="glass grid h-10 w-10 place-items-center rounded-full text-muted transition-colors duration-300 hover:border-cyan/50 hover:text-cyan"
                  >
                    <BrandIcon name={s.name} className="h-4 w-4" />
                  </a>
                </Magnetic>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
