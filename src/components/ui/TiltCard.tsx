"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";

/** A card that leans toward the pointer in 3D, with a glare that tracks it. */
export function TiltCard({
  children,
  className = "",
  max = 10,
  glare = true,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
  "data-cursor"?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const srx = useSpring(rx, { stiffness: 160, damping: 18 });
  const sry = useSpring(ry, { stiffness: 160, damping: 18 });
  const glareBg = useMotionTemplate`radial-gradient(520px circle at ${gx}% ${gy}%, rgba(255,255,255,0.14), transparent 45%)`;

  return (
    <motion.div
      ref={ref}
      className={`group/tilt relative transform-3d ${className}`}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1100 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * max * 2);
        rx.set(-(py - 0.5) * max * 2);
        gx.set(px * 100);
        gy.set(py * 100);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      {...rest}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/tilt:opacity-100"
          style={{ background: glareBg }}
        />
      )}
    </motion.div>
  );
}
