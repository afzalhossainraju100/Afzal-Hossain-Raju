/**
 * Mutable, render-loop friendly state shared between the DOM and the WebGL scene.
 * Deliberately not React state: it changes every frame and nothing should re-render.
 */
export const sceneState = {
  /** Pointer in normalised device coordinates (-1..1, y up). */
  pointer: { x: 0, y: 0, active: false },
  /** Last click, in NDC, and the `performance.now()` it happened at. */
  pulse: { x: 0, y: 0, at: -Infinity },
  reducedMotion: false,
};
