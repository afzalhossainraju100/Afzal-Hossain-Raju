"use client";

import { useLenis } from "lenis/react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { navLinks, profile, socials } from "@/data/portfolio";
import { BrandIcon, CloseIcon, MenuIcon } from "./Icons";
import { Magnetic } from "./Magnetic";

function useActiveSection() {
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    const ids = ["home", ...navLinks.map((l) => l.id)];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);
  return active;
}

export function Navbar() {
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const lenis = useLenis();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > prev && y > 400 && !open);
  });

  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-80 px-4 pt-4 sm:px-6"
        animate={{ y: hidden ? "-120%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav
          aria-label="Main"
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-full py-2 pr-2 pl-3 transition-all duration-500 ${
            scrolled ? "glass shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]" : "border border-transparent"
          }`}
        >
          <a href="#home" className="group flex items-center gap-3" aria-label={`${profile.name} — back to top`}>
            <span className="relative grid h-10 w-10 place-items-center rounded-full bg-linear-to-br from-cyan via-violet to-pink p-px">
              <span className="grid h-full w-full place-items-center rounded-full bg-ink font-display text-sm font-bold transition-colors duration-300 group-hover:bg-transparent group-hover:text-ink">
                {profile.initials}
              </span>
            </span>
            <span className="hidden font-display text-sm font-semibold tracking-wide sm:block">
              {profile.name}
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={`relative block rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                    active === link.id ? "text-ink" : "text-muted hover:text-fg"
                  }`}
                >
                  {active === link.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-fg"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Magnetic className="hidden sm:inline-block">
              <a
                href="#contact"
                className="flex items-center gap-2 rounded-full bg-linear-to-r from-cyan to-violet px-5 py-2.5 text-sm font-semibold text-ink transition-shadow duration-300 hover:shadow-[0_0_30px_-4px_var(--color-cyan)]"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-ink/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-ink" />
                </span>
                Hire me
              </a>
            </Magnetic>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="glass grid h-11 w-11 place-items-center rounded-full lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-90 flex flex-col bg-ink/90 px-6 pt-6 pb-10 backdrop-blur-2xl"
            initial={{ clipPath: "circle(0% at calc(100% - 46px) 46px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 46px) 46px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 46px) 46px)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            data-lenis-prevent
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs tracking-[0.3em] text-muted uppercase">Navigate</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="glass grid h-11 w-11 place-items-center rounded-full"
                aria-label="Close menu"
                autoFocus
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <ul className="mt-12 flex flex-1 flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={`#${link.id}`}
                    onClick={() => setOpen(false)}
                    className="group flex items-baseline gap-4 py-1 font-display text-5xl font-bold tracking-tight"
                  >
                    <span className="font-mono text-xs font-normal text-cyan">0{i + 1}</span>
                    <span className={active === link.id ? "text-gradient" : "transition-colors group-hover:text-cyan"}>
                      {link.label}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="glass grid h-11 w-11 place-items-center rounded-full text-muted transition-colors hover:text-cyan"
                >
                  <BrandIcon name={s.name} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
