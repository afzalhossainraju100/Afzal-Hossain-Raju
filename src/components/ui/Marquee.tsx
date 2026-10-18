"use client";

import { motion, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { SparkIcon } from "./Icons";

/** Endless ribbon of words that skews with scroll speed. */
export function Marquee({ words, reverse = false }: { words: string[]; reverse?: boolean }) {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const skew = useSpring(useTransform(velocity, [-2500, 0, 2500], [-7, 0, 7]), {
    stiffness: 260,
    damping: 40,
  });
  const row = [...words, ...words];

  return (
    <motion.div
      aria-hidden
      style={{ skewX: skew }}
      className="mask-fade-x relative overflow-hidden border-y border-line py-6 select-none"
    >
      <div
        className="flex w-max animate-marquee items-center gap-10"
        style={{ animationDirection: reverse ? "reverse" : "normal" }}
      >
        {row.map((word, i) => (
          <span key={i} className="flex items-center gap-10">
            <span
              className={`font-display text-4xl font-bold tracking-tight uppercase sm:text-6xl ${
                i % 2 === 0 ? "text-outline" : "text-fg/90"
              }`}
            >
              {word}
            </span>
            <SparkIcon className={`h-5 w-5 ${i % 3 === 0 ? "text-cyan" : i % 3 === 1 ? "text-violet" : "text-pink"}`} />
          </span>
        ))}
      </div>
    </motion.div>
  );
}
