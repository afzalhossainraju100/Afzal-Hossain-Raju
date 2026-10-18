import { Mesh, MeshBasicMaterial, TorusKnotGeometry, Vector3 } from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

/**
 * Every generator returns `count * 3` floats so any shape can morph into any other.
 * Shapes are authored around the origin at roughly radius 2–3.5 world units.
 */
export type ShapeName =
  | "galaxy"
  | "sphere"
  | "helix"
  | "terrain"
  | "knot"
  | "portal"
  | "globe";

const TAU = Math.PI * 2;

// Box–Muller: soft gaussian scatter looks far more organic than uniform noise.
function gauss() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
}

function galaxy(count: number) {
  const out = new Float32Array(count * 3);
  const branches = 5;
  const radius = 3.6;
  const spin = 1.15;
  for (let i = 0; i < count; i++) {
    const r = Math.pow(Math.random(), 1.6) * radius;
    const branch = ((i % branches) / branches) * TAU;
    const angle = branch + r * spin;
    const spread = 0.42 * (0.25 + r / radius);
    const rx = Math.pow(Math.random(), 2.6) * (Math.random() < 0.5 ? 1 : -1) * spread * 1.6;
    const ry = gauss() * 0.07 * (1.2 - r / radius);
    const rz = Math.pow(Math.random(), 2.6) * (Math.random() < 0.5 ? 1 : -1) * spread * 1.6;
    out[i * 3] = Math.cos(angle) * r + rx;
    out[i * 3 + 1] = ry;
    out[i * 3 + 2] = Math.sin(angle) * r + rz;
  }
  return out;
}

function sphere(count: number) {
  const out = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const inner = Math.random() < 0.14;
    const y = 1 - (i / (count - 1)) * 2;
    const ring = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const r = inner ? Math.cbrt(Math.random()) * 1.7 : 2.05 + gauss() * 0.035;
    out[i * 3] = Math.cos(theta) * ring * r;
    out[i * 3 + 1] = y * r;
    out[i * 3 + 2] = Math.sin(theta) * ring * r;
  }
  return out;
}

function helix(count: number) {
  const out = new Float32Array(count * 3);
  const height = 7.5;
  const turns = 3.2;
  const radius = 1.0;
  const rungStep = 0.24;
  for (let i = 0; i < count; i++) {
    const kind = Math.random();
    let x: number;
    let y: number;
    let z: number;
    if (kind < 0.68) {
      // Backbone strands
      const t = Math.random();
      const strand = i % 2 === 0 ? 0 : Math.PI;
      const a = t * turns * TAU + strand;
      y = (t - 0.5) * height;
      x = Math.cos(a) * radius + gauss() * 0.06;
      z = Math.sin(a) * radius + gauss() * 0.06;
    } else {
      // Base-pair rungs between the strands
      const rung = Math.round(((Math.random() - 0.5) * height) / rungStep) * rungStep;
      const t = rung / height + 0.5;
      const a = t * turns * TAU;
      const s = Math.random() * 2 - 1;
      y = rung + gauss() * 0.015;
      x = Math.cos(a) * radius * s;
      z = Math.sin(a) * radius * s;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

function terrain(count: number) {
  const out = new Float32Array(count * 3);
  const size = 11;
  const cols = Math.ceil(Math.sqrt(count * 1.6));
  for (let i = 0; i < count; i++) {
    const gx = (i % cols) / cols - 0.5;
    const gz = Math.floor(i / cols) / (count / cols) - 0.5;
    const x = gx * size + (Math.random() - 0.5) * 0.04;
    const z = gz * size * 0.75 + (Math.random() - 0.5) * 0.04;
    const y =
      Math.sin(x * 0.9) * 0.35 +
      Math.cos(z * 1.3 + x * 0.4) * 0.3 +
      Math.sin((x + z) * 0.5) * 0.25;
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

function knot(count: number) {
  const out = new Float32Array(count * 3);
  const geometry = new TorusKnotGeometry(1.45, 0.42, 320, 40, 2, 3);
  const mesh = new Mesh(geometry, new MeshBasicMaterial());
  const sampler = new MeshSurfaceSampler(mesh).build();
  const p = new Vector3();
  for (let i = 0; i < count; i++) {
    sampler.sample(p);
    out[i * 3] = p.x;
    out[i * 3 + 1] = p.y;
    out[i * 3 + 2] = p.z;
  }
  geometry.dispose();
  return out;
}

function portal(count: number) {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const a = Math.random() * TAU;
    const kind = Math.random();
    let r: number;
    let y: number;
    if (kind < 0.45) {
      // Bright inner rim
      r = 2.0 + gauss() * 0.05;
      y = gauss() * 0.05;
    } else if (kind < 0.85) {
      // Dust disc
      r = 2.25 + Math.pow(Math.random(), 1.8) * 1.4;
      y = gauss() * 0.04;
    } else {
      // Particles being pulled into the centre
      r = Math.pow(Math.random(), 0.6) * 1.9;
      y = gauss() * 0.1;
    }
    out[i * 3] = Math.cos(a) * r;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = Math.sin(a) * r;
  }
  return out;
}

/** Latitude/longitude graticule globe with a beam rising from Dhaka. */
function globe(count: number) {
  const out = new Float32Array(count * 3);
  const R = 2.0;
  const dhakaLat = (23.81 * Math.PI) / 180;
  const dhakaLon = (90.41 * Math.PI) / 180;
  const toXYZ = (lat: number, lon: number, r: number, i: number) => {
    out[i * 3] = r * Math.cos(lat) * Math.cos(lon);
    out[i * 3 + 1] = r * Math.sin(lat);
    out[i * 3 + 2] = -r * Math.cos(lat) * Math.sin(lon);
  };
  for (let i = 0; i < count; i++) {
    const kind = Math.random();
    if (kind < 0.42) {
      // Latitude rings every 15°
      const lat = (Math.round((Math.random() - 0.5) * 11) * 15 * Math.PI) / 180;
      toXYZ(lat, Math.random() * TAU, R, i);
    } else if (kind < 0.84) {
      // Meridians every 20°
      const lon = (Math.round(Math.random() * 18) * 20 * Math.PI) / 180;
      toXYZ((Math.random() - 0.5) * Math.PI, lon, R, i);
    } else if (kind < 0.94) {
      // Faint atmosphere
      const u = Math.random() * 2 - 1;
      toXYZ(Math.asin(u), Math.random() * TAU, R * (1.04 + Math.random() * 0.12), i);
    } else {
      // Beam + glow over Dhaka
      const t = Math.random();
      const beam = Math.random() < 0.6;
      const lat = dhakaLat + (beam ? gauss() * 0.006 : gauss() * 0.05);
      const lon = dhakaLon + (beam ? gauss() * 0.006 : gauss() * 0.05);
      toXYZ(lat, lon, beam ? R + t * 1.1 : R + Math.abs(gauss()) * 0.03, i);
    }
  }
  return out;
}

const generators: Record<ShapeName, (count: number) => Float32Array> = {
  galaxy,
  sphere,
  helix,
  terrain,
  knot,
  portal,
  globe,
};

export function buildShapes(count: number) {
  const shapes = {} as Record<ShapeName, Float32Array>;
  for (const name of Object.keys(generators) as ShapeName[]) {
    shapes[name] = generators[name](count);
  }
  return shapes;
}

/** Four random channels per particle: morph delay, phase/sparkle, size, colour mix. */
export function buildRandoms(count: number) {
  const out = new Float32Array(count * 4);
  for (let i = 0; i < out.length; i++) out[i] = Math.random();
  return out;
}
