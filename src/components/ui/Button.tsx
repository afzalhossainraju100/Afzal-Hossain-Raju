import type { ReactNode } from "react";
import { Magnetic } from "./Magnetic";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  size?: "md" | "sm";
  external?: boolean;
  icon?: ReactNode;
  /** Accessible name, when the visible text alone is ambiguous. */
  label?: string;
};

/** Magnetic pill link. Primary floods with the brand gradient on hover. */
export function ButtonLink({ href, children, variant = "primary", size = "md", external, icon, label }: Props) {
  const base =
    "group relative inline-flex items-center overflow-hidden rounded-full font-semibold tracking-wide transition-colors duration-500";
  const sizes = size === "md" ? "gap-2.5 px-6 py-3.5 text-sm" : "gap-2 px-4 py-2.5 text-[13px]";
  const styles =
    variant === "primary"
      ? "bg-fg text-ink hover:text-ink"
      : "glass text-fg hover:border-cyan/50";

  return (
    <Magnetic>
      <a
        href={href}
        aria-label={label}
        className={`${base} ${sizes} ${styles}`}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {variant === "primary" && (
          <span
            aria-hidden
            className="absolute inset-0 translate-y-full rounded-full bg-linear-to-r from-cyan via-violet to-pink transition-transform duration-500 ease-out-expo group-hover:translate-y-0"
          />
        )}
        <span className="relative">{children}</span>
        {icon && (
          <span className="relative transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            {icon}
          </span>
        )}
      </a>
    </Magnetic>
  );
}
