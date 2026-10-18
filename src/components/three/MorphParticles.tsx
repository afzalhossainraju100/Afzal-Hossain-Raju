"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  MathUtils,
  Points,
  ShaderMaterial,
} from "three";
import { sceneState } from "@/lib/scene-state";
import { adaptForViewport, scenes, type SceneKey } from "./scene-config";
import { buildRandoms, buildShapes, type ShapeName } from "./shapes";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMix;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uAspect;
  uniform vec2 uMouse;
  uniform float uMouseStrength;
  uniform vec2 uPulseOrigin;
  uniform float uPulseTime;
  uniform float uVelocity;
  uniform vec2 uWave;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute vec4 aRandom;

  varying vec3 vColor;
  varying float vAlpha;

  vec3 flow(vec3 p, float t) {
    return vec3(
      sin(p.y * 1.7 + t * 1.1) + sin(p.z * 0.9 - t * 0.7),
      sin(p.z * 1.3 + t * 0.9) + sin(p.x * 1.1 + t * 0.6),
      sin(p.x * 1.5 - t * 1.0) + sin(p.y * 0.8 + t * 0.8)
    ) * 0.5;
  }

  void main() {
    // Staggered morph: every particle leaves at a slightly different moment.
    float m = clamp((uMix - aRandom.x * 0.4) / 0.6, 0.0, 1.0);
    m = m * m * (3.0 - 2.0 * m);
    vec3 pos = mix(aFrom, aTo, m);

    // Particles swirl apart mid-flight and when the page is scrolled hard.
    float transit = sin(m * 3.14159265);
    float phase = aRandom.y * 6.2831853;
    pos += flow(pos * 0.7 + phase, uTime * 0.5) * (0.035 + transit * 0.55 + uVelocity * 0.3);

    // Rolling waves, only while the terrain shape is showing.
    float wave = mix(uWave.x, uWave.y, m);
    pos.y += sin(pos.x * 1.1 + uTime * 0.9) * cos(pos.z * 0.9 + uTime * 0.6) * 0.24 * wave;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vec4 clip = projectionMatrix * mv;
    vec2 ndc = clip.xy / clip.w;
    float depthScale = -mv.z / 7.0;

    // Pointer pushes particles away.
    vec2 toMouse = (ndc - uMouse) * vec2(uAspect, 1.0);
    float md = length(toMouse);
    float force = smoothstep(0.34, 0.0, md) * uMouseStrength;
    mv.xy += (toMouse / max(md, 0.0001)) * force * 0.55 * depthScale;

    // Click shockwave.
    vec2 toPulse = (ndc - uPulseOrigin) * vec2(uAspect, 1.0);
    float pd = length(toPulse);
    float ring = exp(-pow((pd - uPulseTime * 1.6) * 5.0, 2.0)) * exp(-uPulseTime * 1.5);
    mv.xy += (toPulse / max(pd, 0.0001)) * ring * 0.7 * depthScale;
    mv.z += ring * 0.6;

    gl_Position = projectionMatrix * mv;

    float size = uSize * (0.35 + aRandom.z * 1.25) * (1.0 + ring * 1.8 + force * 0.9);
    gl_PointSize = size * uPixelRatio / -mv.z;

    vec3 col = mix(uColorA, uColorB, aRandom.w);
    col = mix(col, uColorC, step(0.94, aRandom.y));
    col += vec3(ring * 0.7 + force * 0.45);
    vColor = col;
    vAlpha = 0.3 + aRandom.z * 0.7;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d);
    a *= a;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a * vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;

type Anchor = { key: SceneKey; top: number };

/** Tracks every `[data-scene]` section's document offset. */
function useSceneAnchors() {
  const anchors = useRef<Anchor[]>([]);
  useEffect(() => {
    const measure = () => {
      const nodes = document.querySelectorAll<HTMLElement>("[data-scene]");
      anchors.current = Array.from(nodes)
        .filter((n) => n.dataset.scene! in scenes)
        .map((n) => ({
          key: n.dataset.scene as SceneKey,
          top: n.getBoundingClientRect().top + window.scrollY,
        }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  return anchors;
}

/** 0 at the first section, n-1 at the last; fractional while a new section scrolls in. */
function scrollProgress(anchors: Anchor[]) {
  const vh = window.innerHeight;
  const y = window.scrollY;
  let p = 0;
  for (let i = 1; i < anchors.length; i++) {
    p += MathUtils.clamp((y + vh * 0.85 - anchors[i].top) / (vh * 0.6), 0, 1);
  }
  return p;
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const tmpA = new Color();
const tmpB = new Color();

export function MorphParticles({ count }: { count: number }) {
  const outer = useRef<Group>(null);
  const inner = useRef<Group>(null);
  // Per-frame mutation goes through this ref, never through the memoised objects directly.
  const points = useRef<Points<BufferGeometry, ShaderMaterial>>(null);
  const { gl, size } = useThree();
  const anchors = useSceneAnchors();

  const attributes = useMemo(() => {
    const shapes = buildShapes(count);
    const map = {} as Record<ShapeName, BufferAttribute>;
    for (const key of Object.keys(shapes) as ShapeName[]) {
      map[key] = new BufferAttribute(shapes[key], 3);
    }
    return map;
  }, [count]);

  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute("position", attributes.galaxy);
    g.setAttribute("aFrom", attributes.galaxy);
    g.setAttribute("aTo", attributes.galaxy);
    g.setAttribute("aRandom", new BufferAttribute(buildRandoms(count), 4));
    return g;
  }, [attributes, count]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uMix: { value: 0 },
          uSize: { value: 26 },
          uPixelRatio: { value: 1 },
          uAspect: { value: 1 },
          uMouse: { value: [0, 0] },
          uMouseStrength: { value: 0 },
          uPulseOrigin: { value: [0, 0] },
          uPulseTime: { value: 10 },
          uVelocity: { value: 0 },
          uWave: { value: [0, 0] },
          uOpacity: { value: 0 },
          uColorA: { value: new Color(scenes.hero.colors[0]) },
          uColorB: { value: new Color(scenes.hero.colors[1]) },
          uColorC: { value: new Color(scenes.hero.colors[2]) },
        },
      }),
    [],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  const live = useRef({
    progress: 0,
    segment: -1,
    lastScroll: 0,
    velocity: 0,
    mouse: [0, 0] as [number, number],
    time: 0,
    intro: 0,
  });

  useFrame((_, rawDelta) => {
    const cloud = points.current;
    if (!cloud) return;
    const dt = Math.min(rawDelta, 1 / 20);
    const s = live.current;
    const u = cloud.material.uniforms;
    const reduced = sceneState.reducedMotion;
    const list = anchors.current;
    const aspect = size.width / size.height;

    // Scroll → morph progress (damped so jumps glide instead of snap).
    const last = Math.max(list.length - 1, 0);
    const target = list.length > 1 ? scrollProgress(list) : 0;
    s.progress = MathUtils.damp(s.progress, target, reduced ? 6 : 3.2, dt);
    const p = MathUtils.clamp(s.progress, 0, last);
    const segment = list.length > 1 ? Math.min(Math.floor(p), last - 1) : 0;
    const t = list.length > 1 ? p - segment : 0;

    const fromKey: SceneKey = list[segment]?.key ?? "hero";
    const toKey: SceneKey = list[segment + 1]?.key ?? fromKey;
    const from = adaptForViewport(scenes[fromKey], aspect);
    const to = adaptForViewport(scenes[toKey], aspect);

    if (segment !== s.segment) {
      s.segment = segment;
      cloud.geometry.setAttribute("aFrom", attributes[from.shape]);
      cloud.geometry.setAttribute("aTo", attributes[to.shape]);
      u.uWave.value = [from.shape === "terrain" ? 1 : 0, to.shape === "terrain" ? 1 : 0];
    }

    // Scroll velocity adds turbulence.
    const y = window.scrollY;
    const v = Math.abs(y - s.lastScroll) / Math.max(dt, 1e-3);
    s.lastScroll = y;
    s.velocity = MathUtils.damp(s.velocity, Math.min(v / 2600, 1), 4, dt);

    s.time += dt * (reduced ? 0.25 : 1);
    s.intro = Math.min(1, s.intro + dt * 0.6);

    // Pointer, smoothed.
    const ptr = sceneState.pointer;
    s.mouse[0] = MathUtils.damp(s.mouse[0], ptr.x, 8, dt);
    s.mouse[1] = MathUtils.damp(s.mouse[1], ptr.y, 8, dt);
    u.uMouse.value = s.mouse;
    u.uMouseStrength.value = MathUtils.damp(
      u.uMouseStrength.value,
      ptr.active && !reduced ? 1 : 0,
      5,
      dt,
    );

    const pulseAge = (performance.now() - sceneState.pulse.at) / 1000;
    u.uPulseOrigin.value = [sceneState.pulse.x, sceneState.pulse.y];
    u.uPulseTime.value = reduced ? 10 : Math.min(pulseAge, 10);

    u.uTime.value = s.time;
    u.uMix.value = t;
    u.uVelocity.value = reduced ? 0 : s.velocity;
    u.uAspect.value = aspect;
    u.uPixelRatio.value = gl.getPixelRatio();
    u.uSize.value = aspect < 1 ? 22 : 26;

    // Layout blend between the two sections.
    const e = easeInOut(t);
    const introEase = 1 - Math.pow(1 - s.intro, 3);
    u.uOpacity.value = MathUtils.lerp(from.opacity, to.opacity, e) * introEase;
    for (const [i, key] of (["uColorA", "uColorB", "uColorC"] as const).entries()) {
      (u[key].value as Color).copy(tmpA.set(from.colors[i]).lerp(tmpB.set(to.colors[i]), e));
    }

    const o = outer.current;
    const n = inner.current;
    if (!o || !n) return;
    o.position.set(
      MathUtils.lerp(from.position[0], to.position[0], e),
      MathUtils.lerp(from.position[1], to.position[1], e),
      MathUtils.lerp(from.position[2], to.position[2], e),
    );
    o.rotation.set(
      MathUtils.lerp(from.rotation[0], to.rotation[0], e) - s.mouse[1] * 0.12,
      MathUtils.lerp(from.rotation[1], to.rotation[1], e) + s.mouse[0] * 0.18,
      MathUtils.lerp(from.rotation[2], to.rotation[2], e),
    );
    o.scale.setScalar(MathUtils.lerp(from.scale, to.scale, e) * (0.6 + 0.4 * introEase));
    n.rotation.y += MathUtils.lerp(from.spin, to.spin, e) * dt * (reduced ? 0.3 : 1) * (1 + s.velocity * 3);
  });

  return (
    <group ref={outer}>
      <group ref={inner}>
        <points ref={points} geometry={geometry} material={material} frustumCulled={false} />
      </group>
    </group>
  );
}
