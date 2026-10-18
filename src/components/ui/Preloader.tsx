"use client";

import { useLenis } from "lenis/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { profile } from "@/data/portfolio";
import { useMediaQuery } from "@/lib/hooks";
import { finishIntro } from "@/lib/intro";

const DURATION = 1500;

export function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const visible = !done && !reduced;
  const lenis = useLenis();

  useEffect(() => {
    if (reduced) {
      finishIntro();
      return;
    }
    let raf = 0;
    let timeout = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      setCount(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else
        timeout = window.setTimeout(() => {
          setDone(true);
          finishIntro();
        }, 220);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [reduced]);

  useEffect(() => {
    if (!lenis) return;
    if (visible) lenis.stop();
    else lenis.start();
  }, [lenis, visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="preloader fixed inset-0 z-90 flex flex-col justify-between overflow-hidden bg-ink p-6 sm:p-10"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden
        >
          <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.3em] text-muted uppercase">
            <span>{profile.name}</span>
            <span className="hidden sm:inline">{profile.roles[0]} · {profile.location}</span>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="relative grid h-24 w-24 place-items-center">
              <div className="absolute inset-0 animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,transparent,var(--color-cyan),var(--color-violet),transparent_70%)] p-px [mask:radial-gradient(farthest-side,transparent_calc(100%-1.5px),black_calc(100%-1px))]" />
              <span className="font-display text-2xl font-bold tracking-tight">{profile.initials}</span>
            </div>
            <p className="font-mono text-xs tracking-[0.3em] text-muted uppercase">Assembling the universe</p>
          </div>

          <div>
            <div className="mb-4 flex items-end justify-between">
              <span className="font-mono text-xs tracking-[0.3em] text-muted uppercase">Loading</span>
              <span className="font-display text-6xl leading-none font-bold tabular-nums sm:text-8xl">
                {String(count).padStart(3, "0")}
              </span>
            </div>
            <div className="h-px w-full bg-line">
              <div
                className="h-full bg-linear-to-r from-cyan via-violet to-pink"
                style={{ width: `${count}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
