"use client";

import Image from "next/image";
import { useState } from "react";
import { posts, type Post } from "@/data/portfolio";
import { ArrowUpRight, PlayIcon } from "../ui/Icons";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";
import { TiltCard } from "../ui/TiltCard";

function VideoCard({ post }: { post: Post }) {
  const [playing, setPlaying] = useState(false);

  return (
    <TiltCard max={4} className="h-full rounded-4xl" data-cursor={playing ? undefined : "Play"}>
      <article className="glass flex h-full flex-col overflow-hidden rounded-4xl">
        <div className="relative aspect-video w-full overflow-hidden bg-ink-2">
          {playing ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${post.youtubeId}?autoplay=1&rel=0`}
              title={post.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 h-full w-full"
              aria-label={`Play ${post.title}`}
            >
              <Image
                src={`https://i.ytimg.com/vi/${post.youtubeId}/hqdefault.jpg`}
                alt=""
                fill
                unoptimized
                sizes="(min-width: 1024px) 700px, 100vw"
                className="object-cover opacity-70 transition-all duration-1000 ease-out-expo group-hover:scale-105 group-hover:opacity-90"
              />
              <span className="absolute inset-0 bg-linear-to-t from-ink via-ink/30 to-transparent" />
              <span className="absolute top-1/2 left-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center">
                <span className="absolute inset-0 animate-ping-slow rounded-full bg-cyan/30" />
                <span className="relative grid h-20 w-20 place-items-center rounded-full bg-fg text-ink shadow-[0_0_50px_-5px_var(--color-cyan)] transition-transform duration-500 ease-out-expo group-hover:scale-110">
                  <PlayIcon className="ml-1 h-7 w-7" />
                </span>
              </span>
            </button>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-between gap-4 p-7 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[11px] tracking-[0.25em] text-cyan uppercase">Video · YouTube</p>
            <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{post.title}</h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{post.description}</p>
          </div>
          <a
            href={post.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm text-muted transition-colors hover:text-cyan"
          >
            Watch on YouTube <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </article>
    </TiltCard>
  );
}

function ArticleCard({ post }: { post: Post }) {
  return (
    <TiltCard max={6} className="h-full rounded-4xl" data-cursor="Read">
      <a
        href={post.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group glass flex h-full items-center gap-5 overflow-hidden rounded-4xl p-5 transition-colors duration-500 hover:border-white/20 sm:gap-6 sm:p-6"
      >
        <div
          className="relative grid aspect-square w-28 shrink-0 place-items-center overflow-hidden rounded-2xl sm:w-36"
          style={{ background: `radial-gradient(circle at 30% 20%, ${post.accent}55, transparent 70%), #0b0920` }}
        >
          {post.image && (
            <Image
              src={post.image}
              alt=""
              width={300}
              height={168}
              className="w-[82%] rounded-lg border border-white/10 shadow-xl transition-transform duration-700 ease-out-expo group-hover:scale-110 group-hover:-rotate-3"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase" style={{ color: post.accent }}>
            Roadmap · Article
          </p>
          <h3 className="mt-2 font-display text-lg leading-snug font-bold sm:text-xl">{post.title}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted">{post.description}</p>
        </div>
        <span className="hidden h-11 w-11 shrink-0 place-items-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-fg group-hover:text-ink sm:grid">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </a>
    </TiltCard>
  );
}

export function Media() {
  const video = posts.find((p) => p.kind === "video");
  const articles = posts.filter((p) => p.kind === "article");

  return (
    <section id="media" data-scene="media" className="relative px-5 py-28 sm:px-10 sm:py-40">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="05"
          eyebrow="Media & notes"
          title="Watch, read, and learn along."
          highlight={["learn"]}
          description="My video resume, plus the roadmaps I recommend to anyone starting out in web development."
        />
        <div className="mt-16 grid gap-6 lg:grid-cols-12">
          {video && (
            <Reveal className="lg:col-span-7">
              <VideoCard post={video} />
            </Reveal>
          )}
          <div className="grid gap-6 lg:col-span-5">
            {articles.map((post, i) => (
              <Reveal key={post.title} delay={0.1 + i * 0.1}>
                <ArticleCard post={post} />
              </Reveal>
            ))}
            <Reveal delay={0.3}>
              <div className="glass rounded-4xl p-6">
                <p className="font-mono text-[10px] tracking-[0.25em] text-muted uppercase">Coming soon</p>
                <p className="mt-2 text-sm leading-relaxed text-fg/90">
                  Long-form write-ups on what I learn building with the MERN stack. Stay tuned.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
