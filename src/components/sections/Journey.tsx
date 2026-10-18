"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { education, experience, type TimelineItem } from "@/data/portfolio";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

function Timeline({ label, items, accent }: { label: string; items: TimelineItem[]; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <div ref={ref}>
      <Reveal className="mb-10 flex items-center gap-4">
        <h3 className="font-display text-3xl font-bold">{label}</h3>
        <span className="h-px flex-1 bg-line" />
        <span className="font-mono text-xs text-muted">{String(items.length).padStart(2, "0")}</span>
      </Reveal>

      <ol className="relative pl-10">
        {/* Rail, and the glowing fill that draws itself as you scroll */}
        <span aria-hidden className="absolute top-2 bottom-2 left-[11px] w-px bg-line" />
        <motion.span
          aria-hidden
          className="absolute top-2 bottom-2 left-[11px] w-px origin-top"
          style={{ scaleY, background: `linear-gradient(${accent}, transparent)`, boxShadow: `0 0 12px ${accent}` }}
        />

        {items.map((item, i) => (
          <li key={`${item.title}-${item.period}`} className="relative pb-10 last:pb-0">
            <span
              aria-hidden
              className="absolute top-6 -left-10 grid h-[23px] w-[23px] place-items-center rounded-full border border-line bg-ink"
            >
              <span
                className={`h-2 w-2 rounded-full ${item.current ? "animate-ping-slow" : ""}`}
                style={{ background: accent }}
              />
              {item.current && (
                <span className="absolute h-2 w-2 rounded-full" style={{ background: accent }} />
              )}
            </span>

            <Reveal delay={i * 0.08} y={36}>
              <article className="glass group rounded-3xl p-6 transition-colors duration-500 hover:border-white/20 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-mono text-xs tracking-[0.15em] uppercase" style={{ color: accent }}>
                    {item.period}
                  </span>
                  {item.current && (
                    <span className="rounded-full bg-mint/10 px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] text-mint uppercase">
                      Now
                    </span>
                  )}
                </div>
                <h4 className="mt-3 font-display text-xl font-bold sm:text-2xl">{item.title}</h4>
                <p className="mt-1 text-sm text-fg/80">
                  {item.org}
                  {item.place && <span className="text-muted"> · {item.place}</span>}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted sm:text-[15px]">{item.description}</p>
                {item.tags && (
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {item.tags.map((t) => (
                      <li key={t} className="rounded-full border border-line px-2.5 py-1 text-[11px] text-fg/80">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Journey() {
  return (
    <section id="journey" data-scene="journey" className="relative px-5 py-28 sm:px-10 sm:py-40">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="03"
          eyebrow="Journey"
          title="The path so far."
          highlight={["path"]}
          description="Three roles, one organisation, and a degree in progress — each step building on the last."
        />
        <div className="mt-20 grid gap-20 lg:grid-cols-2 lg:gap-16">
          <Timeline label="Experience" items={experience} accent="#22e4ff" />
          <Timeline label="Education" items={education} accent="#a78bfa" />
        </div>
      </div>
    </section>
  );
}
