"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { MathUtils } from "three";
import { sceneState } from "@/lib/scene-state";
import { MorphParticles } from "./MorphParticles";
import { Starfield } from "./Starfield";

function particleBudget() {
  const w = window.innerWidth;
  const cores = navigator.hardwareConcurrency ?? 4;
  if (w < 640 || cores <= 2) return 7000;
  if (w < 1280 || cores <= 4) return 11000;
  return 16000;
}

/** Subtle parallax: the camera leans toward the pointer. */
function CameraRig() {
  useFrame(({ camera }, delta) => {
    const k = sceneState.reducedMotion ? 0 : 1;
    camera.position.x = MathUtils.damp(camera.position.x, sceneState.pointer.x * 0.35 * k, 2.5, delta);
    camera.position.y = MathUtils.damp(camera.position.y, sceneState.pointer.y * 0.22 * k, 2.5, delta);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function BackgroundScene() {
  const [count] = useState(particleBudget);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => (sceneState.reducedMotion = media.matches);
    syncMotion();
    media.addEventListener("change", syncMotion);

    const toNdc = (e: PointerEvent) => ({
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    });
    const onMove = (e: PointerEvent) => {
      const { x, y } = toNdc(e);
      sceneState.pointer.x = x;
      sceneState.pointer.y = y;
      sceneState.pointer.active = e.pointerType === "mouse";
    };
    const onDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [data-no-pulse]")) return;
      const { x, y } = toNdc(e);
      sceneState.pulse = { x, y, at: performance.now() };
    };
    const onLeave = () => (sceneState.pointer.active = false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      media.removeEventListener("change", syncMotion);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45, near: 0.1, far: 120 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <Starfield count={count < 10000 ? 900 : 1600} />
      <MorphParticles count={count} />
      <CameraRig />
    </Canvas>
  );
}
