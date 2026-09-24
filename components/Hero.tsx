"use client";
import { motion, useReducedMotion } from "framer-motion";
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

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
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
  "border border-sky-400/40 bg-[#061433]/70 backdrop-blur-md shadow-[0_0_24px_-6px_rgba(56,189,248,0.55),inset_0_0_20px_rgba(56,189,248,0.06)]";

function InfoStrip({ items, delay }: { items: typeof stackRow; delay: number }) {
  return (
    <motion.div
      {...fadeUp(delay)}
      className={`${glass} grid grid-cols-2 gap-y-4 rounded-[28px] px-5 py-4 sm:rounded-full sm:px-7 md:grid-cols-4`}
    >
      {items.map(({ icon: Icon, title, sub }, i) => (
        <div
          key={title}
          className={`flex items-center gap-3 md:px-4 ${i > 0 ? "md:border-l md:border-sky-400/20" : ""}`}
        >
          <Icon className="shrink-0 text-3xl text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]" />
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
  const float = (d: number) =>
    reduce ? {} : { animate: { y: [0, -8, 0] }, transition: { duration: 5, delay: d, repeat: Infinity, ease: "easeInOut" as const } };

  return (
    <section
      className="relative -mt-20 overflow-hidden bg-[#020b1f] pt-20"
      style={{ fontFamily: "var(--font-display), 'Segoe UI', sans-serif" }}
    >
      {/* Deep blue glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 60% at 72% 45%, rgba(29,78,216,0.35), transparent 70%), radial-gradient(ellipse 50% 40% at 10% 10%, rgba(14,116,144,0.18), transparent 70%), linear-gradient(180deg, #030d26 0%, #020817 100%)",
        }}
      />
      {/* Faint dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(rgba(125,211,252,0.8) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: "radial-gradient(ellipse 30% 30% at 45% 62%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 30% 30% at 45% 62%, black, transparent)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1560px] items-center gap-10 px-4 py-10 sm:px-6 md:px-10 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-4 lg:py-14">
        {/* ---------- Left: copy ---------- */}
        <div className="order-2 min-w-0 lg:order-1">
          {/* Status + role chips: always one line. Sized in em so the row scales with the viewport;
              on phones it scrolls sideways instead of wrapping. */}
          <motion.div
            {...fadeUp(0.1)}
            className="scrollbar-hide -mx-2 -my-3 flex items-center gap-[0.6em] overflow-x-auto px-2 py-3 text-[clamp(10px,1.4vw,14px)] lg:text-[clamp(9px,0.72vw,12px)]"
          >
            <Link
              href="/contact"
              className={`${glass} group inline-flex shrink-0 items-center gap-[0.6em] whitespace-nowrap rounded-full px-[1.1em] py-[0.6em] font-medium text-white`}
            >
              <span className="relative flex h-[0.7em] w-[0.7em]">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-full w-full rounded-full bg-emerald-400" />
              </span>
              Available for New Opportunities
              <FiChevronRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            {roles.map(({ label, icon: Icon }) => (
              <span
                key={label}
                className={`${glass} inline-flex shrink-0 items-center gap-[0.5em] whitespace-nowrap rounded-full px-[0.95em] py-[0.6em] text-white`}
              >
                <Icon className="text-sky-400" />
                {label}
              </span>
            ))}
          </motion.div>

          {/* Headline */}
          <motion.h1 {...fadeUp(0.25)} className="mt-7 font-extrabold leading-[0.98] tracking-tight">
            <span className="block text-[clamp(2.6rem,8vw,5rem)] text-white">Hi, I&apos;m</span>
            <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text pb-2 text-[clamp(2.3rem,7.6vw,5rem)] lg:text-[clamp(3rem,4.6vw,5.4rem)] text-transparent drop-shadow-[0_0_28px_rgba(56,189,248,0.35)] sm:whitespace-nowrap">
              Towfiq Bin Hasan
            </span>
          </motion.h1>

          {/* Tagline: always one line, font scales with the viewport so it fits */}
          <motion.div
            {...fadeUp(0.4)}
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
            {...fadeUp(0.55)}
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
          <motion.div {...fadeUp(0.7)} className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-sky-600 to-cyan-600 px-7 py-3.5 text-base font-semibold text-white shadow-[0_0_18px_-6px_rgba(34,211,238,0.45)] hover:from-sky-500 hover:to-cyan-500 transition-transform duration-300 hover:-translate-y-0.5"
            >
              <FiFolder className="text-xl" />
              View Projects
              <FiArrowRight className="text-lg transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/cv"
              className="group inline-flex items-center gap-3 rounded-full border border-sky-400/60 bg-[#061433]/60 px-7 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-400/10 hover:shadow-[0_0_24px_-6px_rgba(56,189,248,0.8)]"
            >
              <FiDownload className="text-xl transition-transform group-hover:translate-y-0.5" />
              Download CV
            </Link>
          </motion.div>

          {/* Quick links */}
          <motion.div {...fadeUp(0.78)} className="mt-7 flex flex-wrap items-center gap-2.5">
            {quickLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group inline-flex items-center gap-1.5 rounded-full border border-sky-400/25 bg-[#061433]/50 px-4 py-1.5 text-sm text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-400/60 hover:bg-sky-400/10 hover:text-white"
              >
                {l.label}
                <FiArrowUpRight className="text-[0.9em] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Link>
            ))}
          </motion.div>

          {/* Socials */}
          <motion.div {...fadeUp(0.84)} className="mt-6 flex items-center gap-3">
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
                className="social-orb flex h-10 w-10 items-center justify-center rounded-xl border border-sky-400/25 bg-[#061433]/50 text-lg text-slate-400 transition-transform hover:-translate-y-1 sm:h-11 sm:w-11"
              >
                <Icon />
              </a>
            ))}
          </motion.div>

          <div className="mt-10 space-y-5">
            <InfoStrip items={stackRow} delay={0.85} />
            <InfoStrip items={mlRow} delay={1} />
          </div>
        </div>

        {/* ---------- Right: portrait ---------- */}
        <motion.div
          className="order-1 mx-auto flex w-full max-w-[640px] items-center gap-4 sm:gap-6 lg:order-2"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease }}
        >
          {/* Tech icon column */}
          <div className="hidden shrink-0 flex-col gap-3 sm:flex">
            {techColumn.map(({ icon: Icon, color, label }, i) => (
              <motion.div
                key={label}
                title={label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.08, ease }}
                className={`${glass} flex h-14 w-14 items-center justify-center rounded-xl`}
              >
                <Icon className="text-[26px]" style={{ color, filter: `drop-shadow(0 0 6px ${color}99)` }} />
              </motion.div>
            ))}
          </div>

          <div className="relative flex min-w-0 flex-1 justify-center py-8 sm:justify-start">
          <div className="relative h-[228px] w-[228px] xs:h-[266px] xs:w-[266px] sm:h-[300px] sm:w-[300px] xl:h-[380px] xl:w-[380px]">
            {/* Blue glow behind the cube */}
            <div aria-hidden className="absolute -inset-10 rounded-full bg-blue-600/25 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.6] xs:scale-[0.7] sm:scale-[0.79] xl:scale-100">
              <RubikCube />
            </div>
          </div>

          {/* Floating cards */}
          <motion.div {...float(0)} className="absolute -top-2 right-0 hidden sm:block xl:-right-6">
            <Link href="/projects" className={`${glass} group flex w-64 flex-col gap-3 rounded-2xl p-5`}>
              <div className="flex items-center gap-3">
                <LuCode className="shrink-0 text-4xl text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                <p className="border-l border-sky-400/30 pl-3 text-lg font-bold leading-tight text-white">
                  Crafting Digital <span className="text-sky-400">Solutions</span>
                </p>
              </div>
              <div className="flex items-end justify-between gap-2">
                <p className="text-sm text-slate-300">Turning Ideas Into Real Products</p>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sky-400/60 text-sky-300 transition-transform group-hover:translate-x-1">
                  <FiArrowRight />
                </span>
              </div>
            </Link>
          </motion.div>

          <motion.div {...float(1.2)} className="absolute right-0 top-[42%] hidden sm:block xl:-right-10">
            <div className={`${glass} w-60 rounded-2xl p-4`}>
              <div className="flex items-center gap-3">
                <LuBrainCircuit className="shrink-0 text-4xl text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                <p className="border-l border-sky-400/30 pl-3 text-base font-bold leading-tight text-white">
                  AI &amp; Machine <span className="block text-xl text-sky-400">Learning</span>
                </p>
              </div>
              <p className="mt-3 text-xs text-sky-200/80">Data Science Research</p>
              <p className="text-xs text-sky-200/80">Python • TensorFlow • PyTorch</p>
            </div>
          </motion.div>

          <motion.div {...float(2.4)} className="absolute -bottom-2 right-0 xl:-right-6">
            <div className={`${glass} rounded-full px-6 py-3.5`}>
              <p className="flex items-center gap-3 text-base font-semibold text-white">
                <span className="h-3 w-3 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]" />
                Software Engineer
              </p>
              <p className="mt-1.5 flex items-center gap-3 text-sm text-slate-300">
                <LuMapPin className="text-sky-400" />
                Laravel • Next.js • React
              </p>
            </div>
          </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Fade into the next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#020817]" />
    </section>
  );
}
