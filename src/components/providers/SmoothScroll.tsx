"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, type ReactNode } from "react";

/** People who ask for less motion get native scrolling. */
function ReducedMotionGuard() {
  const lenis = useLenis();
  useEffect(() => {
    if (lenis && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      lenis.destroy();
    }
  }, [lenis]);
  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.09, anchors: true, stopInertiaOnNavigate: true }}>
      <ReducedMotionGuard />
      {children}
    </ReactLenis>
  );
}
