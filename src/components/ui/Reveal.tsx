"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { Fragment, type ElementType, type ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

/** Fades and lifts its children into place the first time they scroll into view. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Masked word-by-word rise, the signature heading animation. */
export function SplitWords({
  text,
  as: Tag = "span",
  className,
  wordClassName,
  delay = 0,
  stagger = 0.06,
  animateOnMount = false,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  wordClassName?: (word: string, index: number) => string | undefined;
  delay?: number;
  stagger?: number;
  animateOnMount?: boolean;
}) {
  const words = text.split(" ");
  const trigger = animateOnMount
    ? { animate: "show" as const }
    : { whileInView: "show" as const, viewport: { once: true, margin: "0px 0px -10% 0px" } };

  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        aria-hidden
        className="inline"
        initial="hidden"
        {...trigger}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
      >
        {words.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            <span className="mb-[-0.12em] inline-block overflow-hidden pb-[0.12em] align-top">
              <motion.span
                className={`inline-block will-change-transform ${wordClassName?.(word, i) ?? ""}`}
                variants={{
                  hidden: { y: "110%", rotate: 4 },
                  show: { y: "0%", rotate: 0, transition: { duration: 1, ease } },
                }}
              >
                {word}
              </motion.span>
            </span>
            {i < words.length - 1 && " "}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}
