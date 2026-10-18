"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";

const BackgroundScene = dynamic(() => import("./BackgroundScene"), { ssr: false });

/** If WebGL is unavailable the page still works — it just loses the particles. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function SceneCanvas() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 animate-[fade-in_1.6s_ease-out_both]">
      <SceneBoundary>
        <BackgroundScene />
      </SceneBoundary>
    </div>
  );
}
