"use client";
import type { MouseEvent, ReactNode } from "react";
import { motion } from "framer-motion";

export const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Shared page furniture so every route reads like the home page:
 * a soft spotlight, a numbered/eyebrow heading and the same glass cards.
 */

/** Spotlight + grain behind the top of a page. */
export function PageBackdrop() {
  return (
    /* Full-bleed: the section it sits in is width-capped, so anchoring to the
       section would leave visible vertical edges cutting through the content. */
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[620px] w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% -10%, rgba(14, 165, 233,0.16), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          maskImage: "linear-gradient(to bottom, black 45%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 45%, transparent 100%)",
        }}
      />
    </div>
  );
}

/** Page title block: eyebrow, gradient heading, description, optional extras. */
export function PageHeader({
  eyebrow,
  title,
  accent,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="relative mb-12 flex flex-col items-center text-center sm:mb-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-sky-300/80 sm:text-xs"
      >
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
          className="h-px w-8 origin-right bg-gradient-to-l from-sky-400 to-transparent sm:w-12"
        />
        {eyebrow}
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
          className="h-px w-8 origin-left bg-gradient-to-r from-sky-400 to-transparent sm:w-12"
        />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.1, ease }}
        className="mt-4 text-[1.9rem] font-bold tracking-tight xs:text-4xl sm:text-5xl md:text-6xl"
      >
        {title}{" "}
        <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-sky-400 bg-clip-text text-transparent">
          {accent}
        </span>
      </motion.h1>

      {description && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease }}
          className="mt-5 max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base"
        >
          {description}
        </motion.div>
      )}

      {children && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease }}
          className="mt-8 w-full"
        >
          {children}
        </motion.div>
      )}
    </header>
  );
}

/** Glass card with a cursor-following glow and a lift on hover. */
export function GlowCard({
  children,
  className = "",
  delay = 0,
  lift = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  lift?: boolean;
}) {
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <motion.div
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease }}
      whileHover={lift ? { y: -6 } : undefined}
      className={`glow-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] ${className}`}
    >
      {children}
    </motion.div>
  );
}

/** Small stat tile used on a few pages. */
export function StatTile({
  value,
  label,
  delay = 0,
}: {
  value: ReactNode;
  label: string;
  delay?: number;
}) {
  return (
    <GlowCard delay={delay} className="p-4 text-center sm:p-5">
      <div className="bg-gradient-to-br from-white to-sky-300 bg-clip-text text-2xl font-bold text-transparent xs:text-3xl sm:text-4xl">
        {value}
      </div>
      <p className="mt-1 text-[11px] leading-tight text-gray-400 sm:text-sm">{label}</p>
    </GlowCard>
  );
}
