"use client";

import { useLenis } from "lenis/react";
import { useSyncExternalStore } from "react";
import { contact, navLinks, profile, socials } from "@/data/portfolio";
import { ArrowUp, ArrowUpRight } from "../ui/Icons";
import { Magnetic } from "../ui/Magnetic";

const noopSubscribe = () => () => {};

export function Footer() {
  const lenis = useLenis();
  // Read on the client only; the server snapshot stays deterministic for prerendering.
  const year = useSyncExternalStore(
    noopSubscribe,
    () => new Date().getFullYear(),
    () => null,
  );

  const toTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 2.2 });
    else window.scrollTo({ top: 0 });
  };

  return (
    <footer data-scene="footer" className="relative overflow-hidden border-t border-line px-5 pt-24 pb-10 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-14 pb-16 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[11px] tracking-[0.25em] text-muted uppercase">Have an idea?</p>
            <a
              href={`mailto:${contact.email}`}
              className="group mt-4 inline-flex items-center gap-4 font-display text-5xl font-bold tracking-tight sm:text-7xl"
            >
              <span className="bg-linear-to-r from-fg to-fg bg-size-[0%_2px] bg-bottom-left bg-no-repeat pb-1 transition-[background-size] duration-700 ease-out-expo group-hover:bg-size-[100%_2px]">
                Let&apos;s talk
              </span>
              <span className="grid h-14 w-14 place-items-center rounded-full bg-linear-to-br from-cyan via-violet to-pink text-ink transition-transform duration-500 ease-out-expo group-hover:rotate-45 sm:h-20 sm:w-20">
                <ArrowUpRight className="h-7 w-7 sm:h-9 sm:w-9" />
              </span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-12 text-sm">
            <div>
              <p className="mb-4 font-mono text-[10px] tracking-[0.25em] text-muted uppercase">Sitemap</p>
              <ul className="space-y-2.5">
                {navLinks.map((l) => (
                  <li key={l.id}>
                    <a href={`#${l.id}`} className="text-fg/80 transition-colors hover:text-cyan">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 font-mono text-[10px] tracking-[0.25em] text-muted uppercase">Socials</p>
              <ul className="space-y-2.5">
                {socials.map((s) => (
                  <li key={s.name}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-fg/80 transition-colors hover:text-cyan"
                    >
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p
          aria-hidden
          className="text-outline -mx-1 font-display text-[11vw] leading-[0.9] font-extrabold tracking-tighter select-none sm:text-[6vw] sm:whitespace-nowrap 2xl:text-[5.5rem]"
        >
          {profile.name}
        </p>

        <div className="mt-10 flex flex-col-reverse items-start justify-between gap-6 border-t border-line pt-8 text-xs text-muted sm:flex-row sm:items-center">
          <p>
            © {year ?? ""} {profile.name}. All rights reserved.
          </p>
          <p className="font-mono tracking-wider">Designed & built with Next.js · Three.js · Motion</p>
          <Magnetic>
            <button
              type="button"
              onClick={toTop}
              className="glass group inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-fg transition-colors hover:border-cyan/50"
            >
              Back to top
              <ArrowUp className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5" />
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}
