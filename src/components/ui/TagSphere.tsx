"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Mat3 = number[];

const mul = (a: Mat3, b: Mat3): Mat3 => [
  a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
  a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
  a[0] * b[2] + a[1] * b[5] + a[2] * b[8],
  a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
  a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
  a[3] * b[2] + a[4] * b[5] + a[5] * b[8],
  a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
  a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
  a[6] * b[2] + a[7] * b[5] + a[8] * b[8],
];
const rotY = (t: number): Mat3 => [Math.cos(t), 0, Math.sin(t), 0, 1, 0, -Math.sin(t), 0, Math.cos(t)];
const rotX = (t: number): Mat3 => [1, 0, 0, 0, Math.cos(t), -Math.sin(t), 0, Math.sin(t), Math.cos(t)];

/**
 * A sphere of DOM labels (crisp text, no WebGL) that drifts on its own,
 * steers toward the pointer, and can be flung with a drag.
 */
export function TagSphere({ items }: { items: string[] }) {
  const container = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLSpanElement | null)[]>([]);
  const [radius, setRadius] = useState(0);

  const base = useMemo(() => {
    const golden = Math.PI * (3 - Math.sqrt(5));
    return items.map((_, i) => {
      const y = 1 - ((i + 0.5) / items.length) * 2;
      const r = Math.sqrt(1 - y * y);
      return [Math.cos(golden * i) * r, y, Math.sin(golden * i) * r];
    });
  }, [items]);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setRadius(entry.contentRect.width * 0.38));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = container.current;
    if (!el || !radius) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const idle = reduced ? { x: 0, y: 0 } : { x: 0.32, y: 0.08 };

    let m: Mat3 = mul(rotX(0.35), rotY(0.4));
    let vx = idle.x;
    let vy = idle.y;
    let hover: { x: number; y: number } | null = null;
    let drag: { x: number; y: number; t: number } | null = null;
    let raf = 0;
    let last = performance.now();
    let visible = false;

    const paint = () => {
      for (let i = 0; i < base.length; i++) {
        const node = nodes.current[i];
        if (!node) continue;
        const [bx, by, bz] = base[i];
        const x = (m[0] * bx + m[1] * by + m[2] * bz) * radius;
        const y = (m[3] * bx + m[4] * by + m[5] * bz) * radius;
        const z = (m[6] * bx + m[7] * by + m[8] * bz) * radius;
        const depth = (z + radius) / (2 * radius); // 0 back → 1 front
        node.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${(-y).toFixed(1)}px, 0) scale(${(0.55 + depth * 0.55).toFixed(3)})`;
        node.style.opacity = (0.15 + depth * 0.85).toFixed(3);
        node.style.zIndex = String(Math.round(depth * 100));
        node.dataset.front = depth > 0.82 ? "true" : "false";
      }
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!drag) {
        const target = hover ? { x: hover.x * 2.2, y: hover.y * 2.2 } : idle;
        const k = 1 - Math.exp(-dt * 2.2);
        vx += (target.x - vx) * k;
        vy += (target.y - vy) * k;
        m = mul(mul(rotY(vx * dt), rotX(vy * dt)), m);
      }
      paint();
      if (visible) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else cancelAnimationFrame(raf);
    });
    io.observe(el);
    paint();

    const local = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 };
    };
    const onDown = (e: PointerEvent) => {
      drag = { x: e.clientX, y: e.clientY, t: performance.now() };
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (drag) {
        const now = performance.now();
        const dx = (e.clientX - drag.x) * 0.008;
        const dy = (e.clientY - drag.y) * 0.008;
        const dts = Math.max((now - drag.t) / 1000, 1 / 120);
        m = mul(mul(rotY(dx), rotX(dy)), m);
        vx = Math.max(-6, Math.min(6, dx / dts));
        vy = Math.max(-6, Math.min(6, dy / dts));
        drag = { x: e.clientX, y: e.clientY, t: now };
      } else if (e.pointerType === "mouse" && !reduced) {
        hover = local(e);
      }
    };
    const onUp = (e: PointerEvent) => {
      drag = null;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    const onLeave = () => (hover = null);

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [base, radius]);

  return (
    <div
      ref={container}
      aria-hidden
      data-cursor="Drag"
      data-no-pulse
      className="relative mx-auto aspect-square w-full max-w-130 cursor-grab touch-pan-y select-none active:cursor-grabbing"
    >
      {/* Core glow and orbit rings */}
      <div className="absolute inset-[30%] rounded-full bg-[radial-gradient(circle,rgba(34,228,255,0.35),rgba(139,92,246,0.15)_45%,transparent_70%)] blur-2xl" />
      <div className="absolute inset-[12%] animate-spin-slow rounded-full border border-dashed border-white/10" />
      <div className="absolute inset-[4%] rounded-full border border-white/5" />
      <div className="absolute inset-[20%] rotate-60 rounded-[50%] border border-cyan/15 [transform:rotateX(70deg)]" />

      {items.map((item, i) => (
        <span
          key={item}
          ref={(n) => {
            nodes.current[i] = n;
          }}
          className="glass absolute top-1/2 left-1/2 rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap opacity-0 transition-[color,border-color,box-shadow] duration-300 will-change-transform data-[front=true]:border-cyan/50 data-[front=true]:text-cyan data-[front=true]:shadow-[0_0_24px_-6px_var(--color-cyan)] sm:text-sm"
        >
          {item}
        </span>
      ))}
    </div>
  );
}
