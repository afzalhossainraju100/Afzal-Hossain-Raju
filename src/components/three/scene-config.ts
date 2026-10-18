import type { ShapeName } from "./shapes";

type Vec3 = [number, number, number];

export type SceneKey =
  | "hero"
  | "about"
  | "skills"
  | "journey"
  | "work"
  | "media"
  | "contact"
  | "footer";

export type SceneConfig = {
  shape: ShapeName;
  position: Vec3;
  rotation: Vec3;
  scale: number;
  opacity: number;
  /** Radians per second around the shape's own Y axis. */
  spin: number;
  /** Primary, secondary and sparkle colours. */
  colors: [string, string, string];
};

const CYAN = "#22e4ff";
const VIOLET = "#8b5cf6";
const PINK = "#f472b6";
const BLUE = "#3b82f6";
const MINT = "#5eead4";

/**
 * How the particle field looks while each section is on screen.
 * Each section in the page carries `data-scene="<key>"` and the field morphs between them on scroll.
 */
export const scenes: Record<SceneKey, SceneConfig> = {
  hero: {
    shape: "galaxy",
    position: [2.1, -0.1, 0],
    rotation: [0.95, 0, 0.28],
    scale: 1.08,
    opacity: 1,
    spin: 0.09,
    colors: [CYAN, VIOLET, PINK],
  },
  about: {
    shape: "sphere",
    position: [-2.9, 0, -0.6],
    rotation: [0.25, 0, 0],
    scale: 0.82,
    opacity: 0.75,
    spin: 0.12,
    colors: [VIOLET, CYAN, PINK],
  },
  skills: {
    shape: "helix",
    position: [0.6, -0.2, -2.4],
    rotation: [0.3, 0, 1.15],
    scale: 0.9,
    opacity: 0.38,
    spin: 0.35,
    colors: [CYAN, MINT, VIOLET],
  },
  journey: {
    shape: "terrain",
    position: [0, -2.3, -1.2],
    rotation: [0.38, 0, 0],
    scale: 1,
    opacity: 0.6,
    spin: 0.02,
    colors: [BLUE, CYAN, VIOLET],
  },
  work: {
    shape: "knot",
    position: [0, 0, -1.4],
    rotation: [0.2, 0, 0],
    scale: 1.15,
    opacity: 0.45,
    spin: 0.14,
    colors: [VIOLET, PINK, CYAN],
  },
  media: {
    shape: "portal",
    position: [0, 0.1, -1.2],
    rotation: [1.2, 0, 0.15],
    scale: 1.15,
    opacity: 0.55,
    spin: 0.18,
    colors: [PINK, VIOLET, CYAN],
  },
  contact: {
    shape: "globe",
    position: [2.9, 0.45, -0.6],
    rotation: [0.32, 0, 0],
    scale: 0.9,
    opacity: 0.85,
    spin: 0.12,
    colors: [CYAN, VIOLET, PINK],
  },
  // The globe sinks to rise like a planet behind the giant footer name.
  footer: {
    shape: "globe",
    position: [0, -3.1, -1.5],
    rotation: [0.5, 0, 0],
    scale: 1.75,
    opacity: 0.6,
    spin: 0.06,
    colors: [VIOLET, CYAN, PINK],
  },
};

/** On narrow screens the shape sits behind the content instead of beside it. */
export function adaptForViewport(config: SceneConfig, aspect: number): SceneConfig {
  if (aspect >= 1) return config;
  const t = Math.max(0, Math.min(1, (aspect - 0.5) / 0.5));
  return {
    ...config,
    position: [config.position[0] * t * 0.3, config.position[1] * 0.6, config.position[2] - 0.8],
    scale: config.scale * (0.72 + t * 0.18),
    opacity: config.opacity * 0.6,
  };
}
