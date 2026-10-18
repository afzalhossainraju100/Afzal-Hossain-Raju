"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/lib/hooks";

/**
 * Two-part cursor: a precise dot plus a lagging ring.
 * Any element with `data-cursor="Label"` turns the ring into a labelled lens.
 */
export function Cursor() {
  const fine = useMediaQuery("(pointer: fine)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = fine && !reduced;
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      const labelled = el?.closest<HTMLElement>("[data-cursor]");
      setLabel(labelled?.dataset.cursor || null);
      setHovering(!!el?.closest("a, button, [role='button'], input, textarea, label, [data-cursor]"));
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = label ? 88 : hovering ? 56 : 34;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-100" style={{ opacity: visible ? 1 : 0 }}>
      <motion.div
        className="absolute top-0 left-0 flex items-center justify-center rounded-full border-[1.5px] border-solid"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: size,
          height: size,
          scale: pressed ? 0.82 : 1,
          backgroundColor: label ? "rgba(34,228,255,0.92)" : "rgba(255,255,255,0)",
          borderColor: label ? "rgba(34,228,255,0)" : hovering ? "rgba(34,228,255,0.9)" : "rgba(255,255,255,0.45)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="font-mono text-[11px] font-medium tracking-wider text-ink uppercase"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.div
        className="absolute top-0 left-0 h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_12px_2px_rgba(34,228,255,0.8)]"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: label ? 0 : 1 }}
      />
    </div>
  );
}
