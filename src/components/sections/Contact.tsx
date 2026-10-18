"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent, type ReactNode } from "react";
import { contact, profile, socials } from "@/data/portfolio";
import { useLocalTime } from "@/lib/hooks";
import { ArrowUpRight, BrandIcon, CheckIcon, CopyIcon, MailIcon, PhoneIcon, PinIcon } from "../ui/Icons";
import { Magnetic } from "../ui/Magnetic";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

type Status = "idle" | "sending" | "sent" | "compose" | "failed";
type Draft = { subject: string; body: string };

const topics = ["Freelance project", "Full-time role", "Collaboration", "Just saying hi"];

/** Pre-filled compose links, so the visitor only has to press send. */
function composeLinks({ subject, body }: Draft) {
  const s = encodeURIComponent(subject);
  const b = encodeURIComponent(body);
  return {
    mailto: `mailto:${contact.email}?subject=${s}&body=${b}`,
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${contact.email}&su=${s}&body=${b}`,
    outlook: `https://outlook.office.com/mail/deeplink/compose?to=${contact.email}&subject=${s}&body=${b}`,
  };
}

/**
 * mailto: silently does nothing on computers without a default mail app (common on
 * Windows), so always offer webmail and copy fallbacks alongside it.
 */
function ComposePanel({ draft, failed }: { draft: Draft; failed: boolean }) {
  const [copied, setCopied] = useState(false);
  const links = composeLinks(draft);

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(`To: ${contact.email}\nSubject: ${draft.subject}\n\n${draft.body}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked; the other options still work.
    }
  }

  const option =
    "inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm text-fg transition-colors duration-300 hover:border-cyan/50 hover:text-cyan";

  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="relative mt-6 rounded-2xl border border-cyan/25 bg-cyan/5 p-5"
    >
      <p className="text-sm font-semibold text-fg">
        {failed ? "Couldn't send from here, so send it by email instead." : "Your message is ready to send."}
      </p>
      <p className="mt-1 text-sm text-muted">
        {failed
          ? "Pick where to open it. Everything is already filled in."
          : "Your email app should open with everything filled in. Just press send. Nothing opened? Pick one:"}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a href={links.gmail} target="_blank" rel="noopener noreferrer" className={option}>
          Gmail <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
        <a href={links.outlook} target="_blank" rel="noopener noreferrer" className={option}>
          Outlook <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
        <a href={links.mailto} className={option}>
          <MailIcon className="h-3.5 w-3.5" /> Mail app
        </a>
        <button type="button" onClick={copyDraft} className={option}>
          {copied ? <CheckIcon className="h-3.5 w-3.5 text-mint" /> : <CopyIcon className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy message"}
        </button>
      </div>
    </motion.div>
  );
}

function InfoRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="glass flex items-center gap-4 rounded-2xl p-4 sm:p-5">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-linear-to-br from-cyan/20 to-violet/20 text-cyan">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] tracking-[0.25em] text-muted uppercase">{label}</p>
        <div className="mt-1 truncate text-[15px] font-medium">{children}</div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  type = "text",
  textarea,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  textarea?: boolean;
  autoComplete?: string;
}) {
  const shared =
    "peer w-full rounded-2xl border border-line bg-white/3 px-5 pt-7 pb-3 text-[15px] text-fg placeholder-transparent outline-none transition-colors duration-300 focus:border-cyan/60 focus:bg-white/5";
  return (
    <div className="relative">
      {textarea ? (
        <textarea id={id} name={id} required rows={5} placeholder={label} className={`${shared} resize-none`} />
      ) : (
        <input id={id} name={id} type={type} required placeholder={label} autoComplete={autoComplete} className={shared} />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute top-2.5 left-5 font-mono text-[10px] tracking-[0.2em] text-muted uppercase transition-all duration-300 peer-placeholder-shown:top-5 peer-placeholder-shown:font-sans peer-placeholder-shown:text-[15px] peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-focus:top-2.5 peer-focus:font-mono peer-focus:text-[10px] peer-focus:tracking-[0.2em] peer-focus:text-cyan peer-focus:uppercase"
      >
        {label}
      </label>
    </div>
  );
}

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [topic, setTopic] = useState(topics[0]);
  const [copied, setCopied] = useState(false);
  const time = useLocalTime(profile.timezone);

  // Editing after a send attempt clears the result, so the compose links never go stale.
  const resetStatus = () => {
    if (status !== "sending") setStatus("idle");
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    const subject = `${topic} — portfolio message from ${name}`;
    const body = `${message}\n\n— ${name} (${email})`;
    setDraft({ subject, body });

    // Without a form backend configured, hand off to the visitor's mail app.
    const key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    if (!key) {
      setStatus("compose");
      window.location.href = composeLinks({ subject, body }).mailto;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: key, subject, name, email, message, topic }),
      });
      const json = (await res.json()) as { success?: boolean };
      if (!res.ok || !json.success) throw new Error("Send failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("failed");
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${contact.email}`;
    }
  }

  return (
    <section id="contact" data-scene="contact" className="relative px-5 py-28 sm:px-10 sm:py-40">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="06"
          eyebrow="Contact"
          title={contact.heading}
          highlight={["amazing"]}
          description="Have a project in mind, a role to fill, or just want to say hello? My inbox is always open."
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-3 lg:col-span-5">
            <Reveal>
              <InfoRow icon={<MailIcon className="h-5 w-5" />} label="Email">
                <div className="flex items-center justify-between gap-3">
                  <a href={`mailto:${contact.email}`} className="truncate transition-colors hover:text-cyan">
                    {contact.email}
                  </a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line text-muted transition-colors hover:text-cyan"
                    aria-label={copied ? "Email copied" : "Copy email address"}
                  >
                    {copied ? <CheckIcon className="h-4 w-4 text-mint" /> : <CopyIcon className="h-4 w-4" />}
                  </button>
                </div>
              </InfoRow>
            </Reveal>
            <Reveal delay={0.06}>
              <InfoRow icon={<PhoneIcon className="h-5 w-5" />} label="Phone">
                <a href={contact.phoneHref} className="transition-colors hover:text-cyan">
                  {contact.phone}
                </a>
              </InfoRow>
            </Reveal>
            <Reveal delay={0.12}>
              <InfoRow icon={<PinIcon className="h-5 w-5" />} label="Address">
                {contact.address}
              </InfoRow>
            </Reveal>

            <Reveal delay={0.18} className="glass mt-6 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.25em] text-muted uppercase">Local time · Dhaka</p>
                  <p className="mt-1 font-display text-3xl font-bold tabular-nums">{time || "--:--"}</p>
                </div>
                <span className="flex items-center gap-2 rounded-full bg-mint/10 px-3 py-1.5 text-xs text-mint">
                  <span className="h-1.5 w-1.5 rounded-full bg-mint" /> Available
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-5">
                {socials.map((s) => (
                  <Magnetic key={s.name} strength={0.4}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.name}
                      className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors duration-300 hover:border-cyan/50 hover:text-cyan"
                    >
                      <BrandIcon name={s.name} className="h-4 w-4" />
                    </a>
                  </Magnetic>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-7">
            <form
              onSubmit={onSubmit}
              onInput={resetStatus}
              className="glass relative overflow-hidden rounded-4xl p-6 sm:p-10"
              data-no-pulse
            >
              <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-violet/20 blur-3xl" />
              <h3 className="relative font-display text-2xl font-bold sm:text-3xl">Send a message</h3>
              <p className="relative mt-2 text-sm text-muted">I usually reply within a day or two.</p>

              <fieldset className="relative mt-8">
                <legend className="mb-3 font-mono text-[10px] tracking-[0.25em] text-muted uppercase">
                  What&apos;s it about?
                </legend>
                <div className="flex flex-wrap gap-2">
                  {topics.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setTopic(t);
                        resetStatus();
                      }}
                      aria-pressed={topic === t}
                      className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
                        topic === t
                          ? "border-transparent bg-fg text-ink"
                          : "border-line text-muted hover:border-white/30 hover:text-fg"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="relative mt-6 grid gap-4 sm:grid-cols-2">
                <Field id="name" label="Your name" autoComplete="name" />
                <Field id="email" label="Your email" type="email" autoComplete="email" />
              </div>
              <div className="relative mt-4">
                <Field id="message" label="Tell me about your idea" textarea />
              </div>

              <AnimatePresence>
                {draft && (status === "compose" || status === "failed") && (
                  <ComposePanel key={status} draft={draft} failed={status === "failed"} />
                )}
              </AnimatePresence>

              <div className="relative mt-8 flex flex-wrap items-center justify-between gap-4">
                <AnimatePresence>
                  {status === "sent" && (
                    <motion.p
                      role="status"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="max-w-sm text-sm text-mint"
                    >
                      Message sent. Thank you! I&apos;ll get back to you soon.
                    </motion.p>
                  )}
                </AnimatePresence>
                <Magnetic className="ml-auto inline-block">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-fg px-7 py-4 text-sm font-semibold text-ink disabled:opacity-60"
                  >
                    <span className="absolute inset-0 translate-y-full rounded-full bg-linear-to-r from-cyan via-violet to-pink transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
                    <span className="relative">{status === "sending" ? "Sending…" : "Send message"}</span>
                    <ArrowUpRight className="relative h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
                  </button>
                </Magnetic>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
