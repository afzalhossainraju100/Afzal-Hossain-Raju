"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, ShaderMaterial } from "three";
import { sceneState } from "@/lib/scene-state";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aPhase;
  attribute float aScale;
  varying float vTwinkle;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    vTwinkle = 0.45 + 0.55 * sin(uTime * (0.5 + aPhase * 1.6) + aPhase * 40.0);
    gl_PointSize = 70.0 * aScale * uPixelRatio / -mv.z;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vTwinkle;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vec3(0.75, 0.85, 1.0), a * a * vTwinkle * 0.9);
    #include <colorspace_fragment>
  }
`;

function createStarGeometry(count: number) {
  const g = new BufferGeometry();
  const pos = new Float32Array(count * 3);
  const phase = new Float32Array(count);
  const scale = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = 14 + Math.random() * 36;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi) - 10;
    phase[i] = Math.random();
    scale[i] = 0.3 + Math.pow(Math.random(), 3) * 1.4;
  }
  g.setAttribute("position", new BufferAttribute(pos, 3));
  g.setAttribute("aPhase", new BufferAttribute(phase, 1));
  g.setAttribute("aScale", new BufferAttribute(scale, 1));
  return g;
}

export function Starfield({ count = 1600 }: { count?: number }) {
  const ref = useRef<Points<BufferGeometry, ShaderMaterial>>(null);
  const { gl } = useThree();

  const geometry = useMemo(() => createStarGeometry(count), [count]);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 } },
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

  useFrame((_, delta) => {
    const stars = ref.current;
    if (!stars) return;
    const speed = sceneState.reducedMotion ? 0.2 : 1;
    stars.material.uniforms.uTime.value += delta * speed;
    stars.material.uniforms.uPixelRatio.value = gl.getPixelRatio();
    stars.rotation.y += delta * 0.006 * speed;
    // Gentle drift as the page scrolls — sells the sense of travelling through space.
    stars.rotation.x = window.scrollY * 0.00004;
  });

  return <points ref={ref} geometry={geometry} material={material} frustumCulled={false} />;
}
