import { Reveal, SplitWords } from "./Reveal";

export function SectionHeading({
  index,
  eyebrow,
  title,
  highlight,
  description,
  align = "left",
}: {
  index: string;
  eyebrow: string;
  title: string;
  /** Words in the title to paint with the brand gradient. */
  highlight?: string[];
  description?: string;
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <div className={`max-w-3xl ${centered ? "mx-auto text-center" : ""}`}>
      <Reveal className={`mb-5 flex items-center gap-3 font-mono text-xs tracking-[0.25em] text-cyan uppercase ${centered ? "justify-center" : ""}`}>
        <span className="text-muted">({index})</span>
        <span className="h-px w-10 bg-linear-to-r from-cyan to-transparent" />
        {eyebrow}
      </Reveal>
      <SplitWords
        as="h2"
        text={title}
        className="font-display text-4xl leading-[1.02] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
        wordClassName={(w) => (highlight?.includes(w) ? "text-gradient" : undefined)}
      />
      {description && (
        <Reveal delay={0.15} className="mt-6 text-base leading-relaxed text-pretty text-muted sm:text-lg">
          {description}
        </Reveal>
      )}
    </div>
  );
}
