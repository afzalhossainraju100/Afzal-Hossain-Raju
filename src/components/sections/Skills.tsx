"use client";

import { useRef } from "react";
import { skillGroups, type SkillGroup } from "@/data/portfolio";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";
import { TagSphere } from "../ui/TagSphere";

const accents = ["#22e4ff", "#8b5cf6", "#f472b6", "#5eead4"];
const allSkills = Array.from(new Set(skillGroups.flatMap((g) => g.skills)));

function SkillCard({ group, index }: { group: SkillGroup; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const accent = accents[index % accents.length];

  return (
    <Reveal delay={index * 0.08} className="h-full">
      <div
        ref={ref}
        onPointerMove={(e) => {
          const r = ref.current?.getBoundingClientRect();
          if (!r) return;
          ref.current!.style.setProperty("--x", `${e.clientX - r.left}px`);
          ref.current!.style.setProperty("--y", `${e.clientY - r.top}px`);
        }}
        className="group glass relative h-full overflow-hidden rounded-3xl p-6 transition-colors duration-500 hover:border-white/20"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `radial-gradient(380px circle at var(--x) var(--y), ${accent}22, transparent 45%)` }}
        />
        <div className="relative flex items-center justify-between">
          <span className="font-mono text-xs text-muted">0{index + 1}</span>
          <span
            aria-hidden
            className="h-2.5 w-2.5 rounded-full transition-transform duration-500 group-hover:scale-150"
            style={{ background: accent, boxShadow: `0 0 16px ${accent}` }}
          />
        </div>
        <h3 className="relative mt-8 font-display text-2xl font-bold">{group.title}</h3>
        <p className="relative mt-2 text-sm leading-relaxed text-muted">{group.blurb}</p>
        <ul className="relative mt-6 flex flex-wrap gap-1.5">
          {group.skills.map((skill) => (
            <li key={skill} className="rounded-full border border-line bg-white/3 px-3 py-1 text-xs text-fg/90">
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

export function Skills() {
  return (
    <section id="skills" data-scene="skills" className="relative px-5 py-28 sm:px-10 sm:py-40">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="03"
          eyebrow="Skills & toolkit"
          title="The stack behind the work."
          highlight={["stack"]}
          description="The tools I reach for every day — React and Tailwind on the front, Node, Express and MongoDB on the back, with design thinking from Figma at every step."
        />

        <div className="mt-16 grid items-center gap-14 lg:grid-cols-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {skillGroups.map((group, i) => (
              <SkillCard key={group.title} group={group} index={i} />
            ))}
          </div>

          <Reveal delay={0.15}>
            <TagSphere items={allSkills} />
            <p className="mt-4 text-center font-mono text-[11px] tracking-[0.25em] text-muted uppercase">
              Drag to spin · hover to steer
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
