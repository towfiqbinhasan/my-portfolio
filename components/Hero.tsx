"use client";
import { motion, useReducedMotion } from "framer-motion";
import { Fragment, useEffect, useRef, useState } from "react";
import { gsap, MQ } from "@/lib/gsap";
import Link from "next/link";
import RubikCube from "@/components/RubikCube";
import type { CSSProperties } from "react";
import { FiMail, FiChevronRight, FiDownload, FiArrowRight, FiArrowUpRight, FiFolder } from "react-icons/fi";
import { FaGithub, FaLinkedin, FaFacebook, FaWhatsapp } from "react-icons/fa";
import {
  LuBrainCircuit,
  LuGraduationCap,
  LuNetwork,
  LuChartColumn,
  LuCode,
  LuDatabase,
  LuCloud,
  LuMapPin,
  LuUserSearch,
} from "react-icons/lu";
import { SiLaravel, SiReact, SiNextdotjs, SiJavascript, SiMysql, SiDocker } from "react-icons/si";
import type { IconType } from "react-icons";

const ease = [0.22, 1, 0.36, 1] as const;

const NAME = ["Towfiq", "Bin", "Hasan"];

/** Fade-up intro; holds at the start until `ready` (the loader has lifted). */
const fadeUp = (delay: number, ready = true) => ({
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  animate: ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined,
  transition: { duration: 0.8, delay, ease },
});

const roles: { label: string; icon: IconType }[] = [
  { label: "CS Student", icon: LuGraduationCap },
  { label: "Full Stack Web Developer", icon: LuCode },
  { label: "ML Engineer", icon: LuBrainCircuit },
  { label: "Researcher", icon: LuUserSearch },
];

const techColumn: { icon: IconType; color: string; label: string }[] = [
  { icon: SiLaravel, color: "#FF2D20", label: "Laravel" },
  { icon: SiReact, color: "#61DAFB", label: "React" },
  { icon: SiNextdotjs, color: "#ffffff", label: "Next.js" },
  { icon: SiJavascript, color: "#8CC84B", label: "JavaScript" },
  { icon: SiMysql, color: "#38bdf8", label: "MySQL" },
  { icon: SiDocker, color: "#2496ED", label: "Docker" },
];

const stackRow: { icon: IconType; title: string; sub: string }[] = [
  { icon: SiLaravel, title: "Laravel", sub: "Backend" },
  { icon: SiReact, title: "Next.js / React", sub: "Frontend" },
  { icon: LuDatabase, title: "MySQL / Redis", sub: "Database & Cache" },
  { icon: LuCloud, title: "Docker / Dokploy", sub: "Deployment" },
];

const mlRow: { icon: IconType; title: string; sub: string }[] = [
  { icon: LuBrainCircuit, title: "Machine Learning", sub: "Python • Scikit-learn" },
  { icon: LuChartColumn, title: "Data Science", sub: "Pandas • NumPy" },
  { icon: LuNetwork, title: "Deep Learning", sub: "TensorFlow • PyTorch" },
  { icon: LuGraduationCap, title: "CS Student", sub: "Research & Learning" },
];

const quickLinks = [
  { href: "/experience", label: "Experience" },
  { href: "/research", label: "Research" },
  { href: "/certificate", label: "Certificates" },
  { href: "/contact", label: "Contact" },
];

const socials = [
  { href: "https://github.com/towfiqbinhasan", icon: FaGithub, label: "GitHub", color: "#e6e6e6" },
  { href: "https://www.linkedin.com/in/md-towfiq-bin-hasan-531ba5265/", icon: FaLinkedin, label: "LinkedIn", color: "#0A66C2" },
  { href: "https://www.facebook.com/share/18Zth7mnQQ/", icon: FaFacebook, label: "Facebook", color: "#1877F2" },
  { href: "mailto:towfiqbinhasan@gmail.com", icon: FiMail, label: "Email", color: "#EA4335" },
  { href: "https://wa.me/qr/IHA6ZSEDQZ57M1", icon: FaWhatsapp, label: "WhatsApp", color: "#25D366" },
];

/** Glassy navy card with a thin glowing blue border. */
const glass =
  "border border-sky-400/40 bg-[#0a1428]/70 backdrop-blur-md shadow-[0_0_24px_-6px_rgba(61,147,255,0.55),inset_0_0_20px_rgba(61,147,255,0.06)]";

function InfoStrip({ items, delay, ready }: { items: typeof stackRow; delay: number; ready: boolean }) {
  return (
    <motion.div
      {...fadeUp(delay, ready)}
      className={`${glass} grid grid-cols-2 gap-y-4 rounded-[28px] px-5 py-4 sm:rounded-full sm:px-7 md:grid-cols-4`}
    >
      {items.map(({ icon: Icon, title, sub }, i) => (
        <div
          key={title}
          className={`flex items-center gap-3 md:px-4 ${i > 0 ? "md:border-l md:border-sky-400/20" : ""}`}
        >
          <Icon className="shrink-0 text-3xl text-sky-400 drop-shadow-[0_0_8px_rgba(61,147,255,0.7)]" />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold text-white">{title}</p>
            <p className="truncate text-xs text-sky-300/80">{sub}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const blob = useRef<HTMLDivElement>(null);
  const cue = useRef<HTMLDivElement>(null);
  const name = useRef<HTMLSpanElement>(null);

  // Hold the intro until the page loader's curtain lifts (with a fallback in case it never fires).
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const go = () => setReady(true);
    window.addEventListener("loader:done", go);
    const fallback = setTimeout(go, 2500);
    return () => {
      window.removeEventListener("loader:done", go);
      clearTimeout(fallback);
    };
  }, []);

  // The name: letters tumble in from deep in 3D space one by one, then the word block
  // tilts gently toward the mouse.
  useEffect(() => {
    if (!ready || !name.current) return;
    const chars = name.current.querySelectorAll<HTMLElement>(".hero-char");
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(chars, { opacity: 1 });
        return;
      }
      gsap.fromTo(
        chars,
        {
          opacity: 0,
          rotationX: -110,
          rotationY: () => gsap.utils.random(-50, 50),
          z: -320,
          yPercent: 60,
        },
        {
          opacity: 1,
          rotationX: 0,
          rotationY: 0,
          z: 0,
          yPercent: 0,
          duration: 1.5,
          delay: 0.2,
          ease: "expo.out",
          stagger: 0.055,
        }
      );
      // Each letter hops when the pointer passes over it.
      chars.forEach((c) =>
        c.addEventListener("pointerenter", () =>
          gsap.fromTo(c, { y: 0 }, { y: -14, rotationX: 25, duration: 0.25, ease: "power3.out", yoyo: true, repeat: 1 })
        )
      );
    }, name);

    const el = name.current;
    const rx = gsap.quickTo(el, "rotationX", { duration: 1.2, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 1.2, ease: "power3.out" });
    const tilt = (e: PointerEvent) => {
      rx(((e.clientY / window.innerHeight) * 2 - 1) * -10);
      ry(((e.clientX / window.innerWidth) * 2 - 1) * 14);
    };
    const fine = window.matchMedia("(pointer: fine)").matches && !reduce;
    if (fine) window.addEventListener("pointermove", tilt);
    return () => {
      window.removeEventListener("pointermove", tilt);
      ctx.revert();
    };
  }, [ready, reduce]);

  // Mouse-following glow + scroll parallax (hero shrinks, fades and drifts up as you leave it)
  useEffect(() => {
    const mm = gsap.matchMedia(section);
    mm.add(MQ.motion, () => {
      gsap.to(content.current, {
        scale: 0.9,
        yPercent: -12,
        autoAlpha: 0.15,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: true },
      });
      // The scroll cue slips away as soon as the visitor starts scrolling.
      gsap.to(cue.current, {
        autoAlpha: 0,
        y: 24,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "+=220", scrub: 0.4 },
      });
    });
    mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const el = section.current;
      if (!el || !blob.current) return;
      const x = gsap.quickTo(blob.current, "x", { duration: 1.4, ease: "power3.out" });
      const y = gsap.quickTo(blob.current, "y", { duration: 1.4, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        x(e.clientX - r.left);
        y(e.clientY - r.top);
      };
      el.addEventListener("pointermove", move);
      return () => el.removeEventListener("pointermove", move);
    });
    return () => mm.revert();
  }, []);

  const float = (d: number) =>
    reduce ? {} : { animate: { y: [0, -8, 0] }, transition: { duration: 5, delay: d, repeat: Infinity, ease: "easeInOut" as const } };

  return (
    <section
      ref={section}
      data-world="hero"
      className="relative -mt-20 overflow-hidden pt-20"
    >
      {/* Soft blue blob that drifts after the mouse */}
      <div
        ref={blob}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 hidden h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-[90px] [@media(pointer:fine)]:block"
        style={{ background: "radial-gradient(circle, rgba(47,123,255,0.55), rgba(26,71,184,0.25) 45%, transparent 70%)" }}
      />
      {/* Deep blue glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 60% at 72% 45%, rgba(30,82,210,0.22), transparent 70%), radial-gradient(ellipse 50% 40% at 10% 10%, rgba(18,52,140,0.14), transparent 70%)",
        }}
      />
      {/* Faint dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(rgba(147,213,255,0.8) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: "radial-gradient(ellipse 30% 30% at 45% 62%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 30% 30% at 45% 62%, black, transparent)",
        }}
      />

      {/* Giant outlined word sitting behind the portrait, poster style */}
      <div
        aria-hidden
        className="text-outline pointer-events-none absolute right-4 mix-blend-difference top-1/2 hidden -translate-y-1/2 select-none font-[family-name:var(--font-heading)] text-[clamp(6rem,12vw,14rem)] uppercase leading-none lg:block"
      >
        Portfolio<span className="text-sky-500/40 [-webkit-text-stroke:0]">.</span>
      </div>

      <div ref={content} className="relative mx-auto grid max-w-[1560px] origin-top will-change-transform items-center gap-10 px-4 py-10 sm:px-6 md:px-10 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-4 lg:py-14">
        {/* ---------- Left: copy ---------- */}
        <div className="order-2 min-w-0 lg:order-1">
          {/* Status + role chips. On phones they wrap: status on its own line, roles flow below it.
              From sm up they sit on one line when it fits, and wrap instead of clipping when it does not. */}
          <div className="scrollbar-hide -mx-2 -my-3 flex flex-wrap items-center gap-2 px-2 py-3 text-[12.5px] sm:gap-[0.6em] sm:text-[clamp(10px,1.4vw,14px)] lg:text-[clamp(9px,0.72vw,12px)]">
            {/* Status chip: a comet of light keeps orbiting its border, plus a periodic sweep across it */}
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.94 }}
              animate={ready ? { opacity: 1, y: 0, scale: 1 } : undefined}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              whileHover={reduce ? undefined : { y: -2 }}
              className="shrink-0"
            >
              <Link
                href="/contact"
                className="group relative inline-flex overflow-hidden rounded-full bg-emerald-400/30 p-px shadow-[0_0_22px_-6px_rgba(52,211,153,0.6)] transition-shadow duration-300 hover:shadow-[0_0_30px_-4px_rgba(52,211,153,0.8)]"
              >
                {/* Rotating conic gradient: only its 1px rim shows, reading as light running round the border */}
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 -ml-[15em] -mt-[15em] h-[30em] w-[30em] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_250deg,rgba(110,231,183,0.95)_320deg,rgba(255,255,255,1)_350deg,transparent_360deg)]"
                  animate={reduce ? undefined : { rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative inline-flex items-center gap-[0.65em] overflow-hidden whitespace-nowrap rounded-full bg-[linear-gradient(90deg,#0b1730,#0a1428_60%)] px-[1.1em] py-[0.6em] font-semibold text-white">
                  {!reduce && (
                    <motion.span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/12 to-transparent"
                      initial={{ x: "-150%" }}
                      animate={{ x: "400%" }}
                      transition={{ duration: 1.6, delay: 1.2, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
                    />
                  )}
                  <span className="relative flex h-[0.65em] w-[0.65em]">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-full w-full rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                  </span>
                  <span className="relative">Available for New Opportunities</span>
                  <motion.span
                    className="relative flex text-emerald-300"
                    animate={reduce ? undefined : { x: [0, 3, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <FiChevronRight />
                  </motion.span>
                </span>
              </Link>
            </motion.div>
            <span aria-hidden className="h-0 basis-full sm:hidden" />
            {/* Role chips: pop in one after another, then a glow wave keeps travelling across them */}
            {roles.map(({ label, icon: Icon }, i) => (
              <motion.span
                key={label}
                initial={{ opacity: 0, y: 14, scale: 0.94 }}
                animate={ready ? { opacity: 1, y: 0, scale: 1 } : undefined}
                transition={{ duration: 0.55, delay: 0.22 + i * 0.09, ease }}
                whileHover={reduce ? undefined : { y: -2 }}
                className={`${glass} group relative inline-flex shrink-0 cursor-default items-center gap-[0.55em] whitespace-nowrap rounded-full py-[0.4em] pl-[0.4em] pr-[1em] font-medium text-slate-100 transition-[border-color,box-shadow,color] duration-300 hover:border-sky-300/70 hover:text-white hover:shadow-[0_0_26px_-4px_rgba(61,147,255,0.7),inset_0_0_20px_rgba(61,147,255,0.1)]`}
              >
                {!reduce && (
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute -inset-px rounded-full border border-sky-300/80 shadow-[0_0_22px_-2px_rgba(61,147,255,0.75),inset_0_0_16px_rgba(61,147,255,0.18)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.4, delay: 1.4 + i * 0.45, repeat: Infinity, repeatDelay: 2.6, ease: "easeInOut" }}
                  />
                )}
                <motion.span
                  className="relative flex h-[1.9em] w-[1.9em] items-center justify-center rounded-full bg-sky-400/10 ring-1 ring-sky-400/30 transition-colors duration-300 group-hover:bg-sky-400/20 group-hover:ring-sky-300/60"
                  animate={reduce ? undefined : { scale: [1, 1.12, 1] }}
                  transition={{ duration: 1.4, delay: 1.4 + i * 0.45, repeat: Infinity, repeatDelay: 2.6, ease: "easeInOut" }}
                >
                  <Icon className="text-sky-300" />
                </motion.span>
                <span className="relative">{label}</span>
              </motion.span>
            ))}
          </div>

          {/* Headline: the greeting slides up out of a mask, then the name builds itself in 3D */}
          <h1 className="mt-7 leading-[0.92]">
            <span className="block overflow-hidden pb-1">
              <motion.span
                className="font-script block -rotate-2 text-[clamp(2rem,5vw,3.2rem)] text-sky-500"
                initial={{ y: "110%" }}
                animate={ready ? { y: "0%" } : undefined}
                transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                Hi, I&apos;m
              </motion.span>
            </span>
            <span className="mt-1 block pb-3 [perspective:900px]">
              <span className="sr-only">Towfiq Bin Hasan</span>
              <span
                ref={name}
                aria-hidden
                className="hero-name-3d block text-[clamp(3rem,10.5vw,6rem)] text-white [transform-style:preserve-3d] lg:text-[clamp(3.6rem,6vw,7.2rem)] sm:whitespace-nowrap"
              >
                {NAME.map((word, w) => (
                  <Fragment key={word}>
                    {w > 0 && " "}
                    <span className="inline-block whitespace-nowrap [transform-style:preserve-3d]">
                      {word.split("").map((c, i) => (
                        <span key={i} className="hero-char" style={{ opacity: 0 }}>
                          {c}
                        </span>
                      ))}
                    </span>
                  </Fragment>
                ))}
              </span>
            </span>
          </h1>

          {/* Tagline: always one line, font scales with the viewport so it fits */}
          <motion.div
            {...fadeUp(0.4, ready)}
            className="mt-3 flex items-center gap-2 whitespace-nowrap text-[clamp(7px,2.1vw,13px)] font-medium uppercase tracking-[0.06em] text-sky-300 sm:gap-3 sm:tracking-[0.08em] lg:text-[clamp(10px,0.95vw,15px)] lg:tracking-[0.14em]"
          >
            <span className="whitespace-nowrap">Full Stack Developer</span>
            {["ML Engineer", "Researcher"].map((role) => (
              <span key={role} className="flex items-center gap-2 sm:gap-3">
                <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-300" />
                {role}
              </span>
            ))}
          </motion.div>

          <motion.p
            {...fadeUp(0.55, ready)}
            className="mt-6 max-w-2xl text-[15px] leading-relaxed text-slate-300 sm:text-lg"
          >
            <b className="font-semibold text-white">Computer Science</b> student at AIUB and{" "}
            <b className="font-semibold text-white">Full Stack Developer</b> specializing in{" "}
            <b className="font-semibold text-white">Machine Learning</b> and{" "}
            <b className="font-semibold text-white">Data Science research</b>. I engineer scalable, production-ready
            web applications with Laravel, Next.js and React, and build data-driven models with Python to solve
            real-world problems.
          </motion.p>

          {/* Actions */}
          <motion.div {...fadeUp(0.7, ready)} className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/projects"
              className="btn-press btn-shine group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-sky-600 to-cyan-600 px-7 py-3.5 text-base font-semibold text-white shadow-[0_0_18px_-6px_rgba(79,195,255,0.45)] hover:from-sky-500 hover:to-cyan-500 hover:shadow-[0_0_28px_-4px_rgba(79,195,255,0.7)]"
            >
              <FiFolder className="text-xl" />
              View Projects
              <FiArrowRight className="text-lg transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/cv"
              className="btn-press btn-shine group inline-flex items-center gap-3 rounded-full border border-sky-400/60 bg-[#0a1428]/60 px-7 py-3.5 text-base font-semibold text-white hover:bg-sky-400/10 hover:shadow-[0_0_24px_-6px_rgba(61,147,255,0.8)]"
            >
              <FiDownload className="text-xl transition-transform group-hover:translate-y-0.5" />
              Download CV
            </Link>
          </motion.div>

          {/* Quick links */}
          <motion.div {...fadeUp(0.78, ready)} className="mt-7 flex flex-wrap items-center gap-2.5">
            {quickLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="btn-press group inline-flex items-center gap-1.5 rounded-full border border-sky-400/25 bg-[#0a1428]/50 px-4 py-1.5 text-sm text-slate-300 hover:border-sky-400/60 hover:bg-sky-400/10 hover:text-white"
              >
                {l.label}
                <FiArrowUpRight className="text-[0.9em] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Link>
            ))}
          </motion.div>

          {/* Socials */}
          <motion.div {...fadeUp(0.84, ready)} className="mt-6 flex items-center gap-3">
            <span aria-hidden className="h-px w-8 bg-gradient-to-r from-sky-400/70 to-transparent" />
            {socials.map(({ href, icon: Icon, label, color }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                title={label}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                style={{ "--sc": color } as CSSProperties}
                className="social-orb flex h-10 w-10 items-center justify-center rounded-xl border border-sky-400/25 bg-[#0a1428]/50 text-lg text-slate-400 transition-transform hover:-translate-y-1 sm:h-11 sm:w-11"
              >
                <Icon />
              </a>
            ))}
          </motion.div>

          <div className="mt-10 space-y-5">
            <InfoStrip items={stackRow} delay={0.85} ready={ready} />
            <InfoStrip items={mlRow} delay={1} ready={ready} />
          </div>
        </div>

        {/* ---------- Right: portrait ---------- */}
        <motion.div
          className="order-1 mx-auto flex w-full max-w-[640px] items-center justify-center lg:order-2 lg:max-w-none"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={ready ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 1.2, delay: 0.2, ease }}
        >
          {/* Tech icon column */}
          <div className="mr-3 hidden shrink-0 flex-col gap-3 sm:flex">
            {techColumn.map(({ icon: Icon, color, label }, i) => (
              <motion.div
                key={label}
                title={label}
                initial={{ opacity: 0, x: -16 }}
                animate={ready ? { opacity: 1, x: 0 } : undefined}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.08, ease }}
                className={`${glass} flex h-14 w-14 items-center justify-center rounded-xl`}
              >
                <Icon className="text-[26px]" style={{ color, filter: `drop-shadow(0 0 6px ${color}99)` }} />
              </motion.div>
            ))}
          </div>

          {/* Cube. The cursor mode covers the whole area (glow included): the scaled-down,
              tilted cube spills past its own box, so its edges would otherwise miss it. */}
          <div data-cursor-mode="rotate" className="relative h-[228px] w-[228px] shrink-0 xs:h-[266px] xs:w-[266px] md:h-[300px] md:w-[300px] xl:h-[266px] xl:w-[266px] 2xl:h-[330px] 2xl:w-[330px]">
            {/* Blue glow behind the cube */}
            <div aria-hidden className="absolute -inset-10 rounded-full bg-blue-600/25 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.6] xs:scale-[0.7] md:scale-[0.79] xl:scale-[0.7] 2xl:scale-[0.87]">
              <RubikCube />
            </div>
          </div>

          {/* Info cards: stacked close together, with a clear gap from the cube.
              Hidden on phones and on small laptops (lg), where there's no room beside the cube. */}
          <div className="ml-5 hidden w-48 shrink-0 flex-col gap-4 sm:flex lg:hidden xl:flex 2xl:ml-8 2xl:w-60">
            <motion.div {...float(0)}>
              <Link href="/projects" className={`${glass} group flex flex-col gap-3 rounded-2xl p-4 2xl:p-5`}>
                <div className="flex items-center gap-3">
                  <LuCode className="shrink-0 text-3xl text-sky-400 drop-shadow-[0_0_8px_rgba(61,147,255,0.8)] 2xl:text-4xl" />
                  <p className="border-l border-sky-400/30 pl-3 text-base font-bold leading-tight text-white 2xl:text-lg">
                    Crafting Digital <span className="text-sky-400">Solutions</span>
                  </p>
                </div>
                <div className="flex items-end justify-between gap-2">
                  <p className="text-xs text-slate-300 2xl:text-sm">Turning Ideas Into Real Products</p>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sky-400/60 text-sky-300 transition-transform group-hover:translate-x-1">
                    <FiArrowRight />
                  </span>
                </div>
              </Link>
            </motion.div>

            <motion.div {...float(1.2)}>
              <div className={`${glass} rounded-2xl p-4`}>
                <div className="flex items-center gap-3">
                  <LuBrainCircuit className="shrink-0 text-3xl text-sky-400 drop-shadow-[0_0_8px_rgba(61,147,255,0.8)] 2xl:text-4xl" />
                  <p className="border-l border-sky-400/30 pl-3 text-sm font-bold leading-tight text-white 2xl:text-base">
                    AI &amp; Machine <span className="block text-lg text-sky-400 2xl:text-xl">Learning</span>
                  </p>
                </div>
                <p className="mt-3 text-[11px] text-sky-200/80 2xl:text-xs">Data Science Research</p>
                <p className="text-[11px] text-sky-200/80 2xl:text-xs">Python • TensorFlow • PyTorch</p>
              </div>
            </motion.div>

            <motion.div {...float(2.4)}>
              <div className={`${glass} rounded-2xl px-4 py-3`}>
                <p className="flex items-center gap-2.5 text-sm font-semibold text-white 2xl:text-base">
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(61,147,255,0.9)]" />
                  Software Engineer
                </p>
                <p className="mt-1.5 flex items-center gap-2.5 text-xs text-slate-300 2xl:text-sm">
                  <LuMapPin className="shrink-0 text-sky-400" />
                  Laravel • Next.js • React
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue: a mouse with a rolling wheel and chevrons cascading below it */}
      <div
        ref={cue}
        className="relative mb-6 hidden justify-center sm:flex lg:fixed lg:bottom-6 lg:left-[77%] lg:z-30 lg:mb-0 lg:-translate-x-1/2"
      >
        <motion.button
          type="button"
          aria-label="Scroll down"
          onClick={() => {
            const next = section.current?.nextElementSibling as HTMLElement | null;
            if (!next) return;
            const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).__lenis;
            if (lenis) lenis.scrollTo(next, { offset: -60, duration: 1.4 });
            else next.scrollIntoView({ behavior: "smooth" });
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, delay: 1.2, ease }}
          className="group flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-slate-400 transition-colors hover:text-white"
        >
          <span className="relative flex h-10 w-6 justify-center rounded-full border border-sky-400/40 pt-2 shadow-[0_0_18px_-4px_rgba(47,123,255,0.7)] transition-colors group-hover:border-sky-300">
            <span className="scroll-cue-wheel h-2 w-[3px] rounded-full bg-gradient-to-b from-cyan-300 to-sky-500" />
          </span>
          <span className="flex flex-col items-center">
            {[0, 0.15, 0.3].map((d) => (
              <span
                key={d}
                className="scroll-cue-chev -mt-1 h-2 w-2 border-b border-r border-sky-400"
                style={{ ["--d" as string]: `${d}s` }}
              />
            ))}
          </span>
          <span>Scroll</span>
        </motion.button>
      </div>
    </section>
  );
}
