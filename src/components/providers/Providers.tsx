"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { SmoothScroll } from "./SmoothScroll";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>{children}</SmoothScroll>
    </MotionConfig>
  );
}
