"use client";
import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, animate, useInView, useReducedMotion } from "framer-motion";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiCalendar,
  FiMapPin,
  FiBriefcase,
  FiFileText,
  FiMail,
  FiCpu,
  FiMap,
  FiCamera,
  FiFilm,
  FiUsers,
  FiDownload,
} from "react-icons/fi";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { SKILLS } from "@/lib/skills";
import { qualifications } from "@/lib/qualifications";
import experienceData from "@/data/experience.json";
import projectsData from "@/data/project.json";
import conferenceData from "@/data/conference.json";
import journalData from "@/data/journal.json";

const ease = [0.22, 1, 0.36, 1] as const;

/* ---------- shared building blocks ---------- */

export function ViewDetails({ href, label }: { href: string; label?: string }) {
  const text = label ?? "View details";
  return (
    <Link href={href} className="btn-press group relative inline-flex overflow-hidden rounded-full p-px">
      <span
        aria-hidden
        className="hero-badge-spin absolute left-1/2 top-1/2 aspect-square w-[300%] -translate-x-1/2 -translate-y-1/2 opacity-70 transition-opacity group-hover:opacity-100"
        style={{ background: "conic-gradient(from 0deg, transparent 0 60%, #a855f7, #22d3ee, transparent 90%)" }}
      />
      <span className="btn-shine relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/10 bg-[#0d0d12] px-5 py-2.5 text-sm font-medium text-white">
        <span className="relative">{text}</span>
        <FiArrowRight className="relative transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  accent,
  text,
  href,
  label,
  center = false,
}: {
  index: string;
  eyebrow: string;
  title: string;
  accent: string;
  text?: string;
  href?: string;
  label?: string;
  center?: boolean;
}) {
  return (
    <div
      className={
        center
          ? "flex flex-col items-center text-center gap-4 mb-10"
          : "flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10"
      }
    >
      <div className={center ? "max-w-2xl" : "max-w-2xl"}>
        <motion.div
          initial={{ opacity: 0, x: center ? 0 : -20, y: center ? 12 : 0 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className={`flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-purple-300/80 ${center ? "justify-center" : ""}`}
        >
          <span className="font-mono text-purple-400">{index}</span>
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="h-px w-10 origin-left bg-gradient-to-r from-purple-400 to-cyan-400"
          />
          {eyebrow}
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="mt-3 sm:mt-4 text-[1.75rem] xs:text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
        >
          {title}{" "}
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">{accent}</span>
        </motion.h2>
        {text && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="mt-3 text-sm sm:text-base text-gray-400 leading-relaxed"
          >
            {text}
          </motion.p>
        )}
      </div>
      {href && !center && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.3, ease }}
          className="hidden md:block flex-shrink-0"
        >
          <ViewDetails href={href} label={label} />
        </motion.div>
      )}
    </div>
  );
}

function Section({
  index,
  eyebrow,
  title,
  accent,
  text,
  href,
  children,
}: {
  index: string;
  eyebrow: string;
  title: string;
  accent: string;
  text: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <section className="relative px-4 sm:px-6 py-12 sm:py-20 max-w-6xl mx-auto">
      <SectionHeading index={index} eyebrow={eyebrow} title={title} accent={accent} text={text} href={href} />

      {children}

      <div className="mt-10 flex justify-center md:hidden">
        <ViewDetails href={href} />
      </div>
    </section>
  );
}

/** Card with a soft glow that follows the cursor, plus a lift on hover. */
function GlowCard({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
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
      whileHover={{ y: -6 }}
      className={`glow-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] ${className}`}
    >
      {children}
    </motion.div>
  );
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    if (reduce) {
      node.textContent = `${to}${suffix}`;
      return;
    }
    const controls = animate(0, to, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => (node.textContent = `${Math.round(v)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, to, suffix, reduce]);

  return <span ref={ref}>0{suffix}</span>;
}

/* ---------- 01 Qualification ---------- */

export function QualificationPreview() {
  return (
    <Section
      index="01"
      eyebrow="Education"
      title="My"
      accent="Qualification"
      text="Currently pursuing a B.Sc. in CSE (Data Science) at AIUB, built on a strong science background."
      href="/qualification"
    >
      <div className="relative grid gap-5 md:grid-cols-3">
        {/* Connecting line that draws itself */}
        <motion.div
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease }}
          className="absolute left-0 right-0 top-[106px] hidden h-px origin-left bg-gradient-to-r from-purple-500 via-cyan-400 to-transparent md:block"
        />
        {qualifications.map((q, i) => (
          <GlowCard key={q.degree} delay={i * 0.12} className="p-4 sm:p-5">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10">
                <Image src={q.image} alt={q.institute} fill sizes="56px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-xs text-purple-200 transition-colors duration-500 group-hover:border-purple-400/60 group-hover:bg-purple-500/20 group-hover:text-white">
                <FiCalendar className="transition-transform duration-500 group-hover:scale-110" /> {q.duration}
              </span>
            </div>
            <div className="relative mt-6 h-3 w-3 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)] transition-transform duration-500 group-hover:scale-150" />
            <h3 className="mt-5 font-semibold text-white leading-snug">{q.degree}</h3>
            <p className="mt-1 text-sm text-purple-300/90">{q.major}</p>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">{q.institute}</p>
          </GlowCard>
        ))}
      </div>
    </Section>
  );
}

/* ---------- 02 Experience ---------- */

type Experience = {
  id: string;
  role: string;
  company: string;
  employmentType: string;
  duration: string;
  location: string;
  logo: string;
};

export function ExperiencePreview() {
  const all = experienceData as Experience[];
  const items = all.slice(0, 3);

  return (
    <Section
      index="02"
      eyebrow="Work"
      title="Professional"
      accent="Experience"
      text={`${all.length} roles so far, across software engineering, web development and data science.`}
      href="/experience"
    >
      <div className="relative space-y-4">
        {items.map((e, i) => {
          const current = /present/i.test(e.duration);
          return (
            <GlowCard key={`${e.id ?? e.company}-${i}`} delay={i * 0.1} className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-white/10">
                  <Image src={e.logo} alt={e.company} fill sizes="56px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white">{e.role}</h3>
                    {current && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] text-emerald-300 ring-1 ring-emerald-400/30">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </span>
                        Current
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-purple-300">{e.company}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1.5"><FiBriefcase /> {e.employmentType}</span>
                    <span className="inline-flex items-center gap-1.5"><FiCalendar /> {e.duration}</span>
                    {e.location && <span className="inline-flex items-center gap-1.5"><FiMapPin /> {e.location}</span>}
                  </div>
                </div>
                <FiArrowUpRight className="hidden sm:block text-xl text-gray-600 transition-all duration-300 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </GlowCard>
          );
        })}
      </div>
    </Section>
  );
}

/* ---------- 03 Skills ---------- */

function SkillRow({ reverse = false }: { reverse?: boolean }) {
  const list = reverse ? [...SKILLS].reverse() : SKILLS;
  return (
    <div className="marquee group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          className={`marquee-track flex flex-shrink-0 gap-3 pr-3 ${reverse ? "marquee-reverse" : ""}`}
        >
          {list.map((s) => (
            <div
              key={s.name}
              className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.07]"
            >
              <s.icon size={20} style={{ color: s.color, filter: `drop-shadow(0 0 6px ${s.color}66)` }} />
              <span className="whitespace-nowrap text-sm text-gray-300">{s.name}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkillsPreview() {
  return (
    <Section
      index="03"
      eyebrow="Toolbox"
      title="Skills &"
      accent="Tools"
      text="Languages, frameworks and tools I use for web development, data science, research and creative work."
      href="/skills"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease }}
        className="space-y-3"
      >
        <SkillRow />
        <SkillRow reverse />
      </motion.div>
    </Section>
  );
}

/* ---------- 04 Projects ---------- */

type Project = {
  title: string;
  desc: string;
  tech: string[];
  images: string[];
  field: string;
};

export function ProjectsPreview() {
  const all = projectsData as Project[];
  const items = all.slice(0, 3);

  return (
    <Section
      index="04"
      eyebrow="Work"
      title="Featured"
      accent="Projects"
      text={`${all.length} projects: full-stack web apps, desktop software and data-driven research.`}
      href="/projects"
    >
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((p, i) => (
          <GlowCard key={p.title} delay={i * 0.12} className="flex flex-col">
            <div className="relative aspect-[16/10] overflow-hidden">
              {p.images?.[0] && (
                <Image
                  src={p.images[0]}
                  alt={p.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/20 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-purple-200 backdrop-blur ring-1 ring-white/10 transition-all duration-500 group-hover:bg-purple-500/40 group-hover:text-white group-hover:ring-purple-400/50">
                {p.field}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-semibold text-white leading-snug">{p.title}</h3>
              <p className="mt-2 text-sm text-gray-400 line-clamp-2">{p.desc}</p>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                {p.tech.slice(0, 4).map((t) => (
                  <span key={t} className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-gray-300 ring-1 ring-white/10">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </GlowCard>
        ))}
      </div>
    </Section>
  );
}

/* ---------- 05 Research ---------- */

type Paper = { title: string; conferenceName: string; year: string | number };

export function ResearchPreview() {
  const papers = conferenceData as Paper[];
  const ieee = papers.filter((p) => /ieee/i.test(p.conferenceName)).length;
  const stats = [
    { value: papers.length, label: "Conference papers" },
    { value: ieee, label: "IEEE conferences" },
    { value: journalData.length, label: "Journal (in progress)" },
  ];

  return (
    <Section
      index="05"
      eyebrow="Academia"
      title="Research &"
      accent="Publications"
      text="Machine learning, TinyML, data mining and environmental data science, presented at international conferences."
      href="/research"
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_2fr]">
        <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 sm:gap-4">
          {stats.map((s, i) => (
            <GlowCard key={s.label} delay={i * 0.1} className="p-3 sm:p-5 text-center lg:text-left">
              <div className="origin-center text-3xl xs:text-4xl sm:text-5xl font-bold bg-gradient-to-br from-white to-purple-300 bg-clip-text text-transparent transition-transform duration-500 group-hover:scale-105 lg:origin-left">
                <CountUp to={s.value} />
              </div>
              <p className="mt-1 text-[11px] leading-tight sm:text-sm text-gray-400 transition-colors duration-500 group-hover:text-purple-200">{s.label}</p>
              <span
                aria-hidden
                className="mx-auto mt-2 block h-px w-6 bg-gradient-to-r from-purple-400 to-cyan-400 transition-all duration-500 group-hover:w-12 lg:mx-0"
              />
            </GlowCard>
          ))}
        </div>
        <div className="space-y-3">
          {papers.slice(0, 3).map((p, i) => (
            <GlowCard key={p.title} delay={0.15 + i * 0.1} className="p-5">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-400/20 text-purple-200 ring-1 ring-purple-400/30 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 group-hover:ring-purple-400/60">
                  <FiFileText />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-white leading-snug line-clamp-2">{p.title}</h3>
                  <p className="mt-1.5 text-xs text-gray-500">
                    <span className="text-purple-300">{p.year}</span> · {p.conferenceName}
                  </p>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------- 07 CV + 08 Contact ---------- */

export function CvContactPreview() {
  return (
    <section className="px-4 sm:px-6 py-12 sm:py-20 max-w-6xl mx-auto">
      <div className="grid gap-5 md:grid-cols-2">
        <GlowCard className="p-6 sm:p-9">
          <div aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-purple-600/20 blur-3xl" />
          <p className="relative flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-purple-300/80">
            <span className="font-mono text-purple-400">08</span> Resume
          </p>
          <h2 className="relative mt-4 text-2xl xs:text-3xl sm:text-4xl font-bold">
            Download my <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">CV</span>
          </h2>
          <p className="relative mt-3 text-gray-400 leading-relaxed">
            CVs tailored for different roles, each with a photo and a Harvard-style version. Request one and get a secure link by email.
          </p>
          <motion.div
            aria-hidden
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative my-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-400 text-2xl text-white shadow-lg shadow-purple-500/40"
          >
            <FiDownload />
          </motion.div>
          <div className="relative">
            <ViewDetails href="/cv" label="Request CV" />
          </div>
        </GlowCard>

        <GlowCard delay={0.12} className="p-6 sm:p-9">
          <div aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />
          <p className="relative flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-purple-300/80">
            <span className="font-mono text-purple-400">09</span> Say hello
          </p>
          <h2 className="relative mt-4 text-2xl xs:text-3xl sm:text-4xl font-bold">
            Let&apos;s <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">connect</span>
          </h2>
          <p className="relative mt-3 text-gray-400 leading-relaxed">
            Have a project, a job opportunity or a research idea? My inbox is always open.
          </p>
          <div className="relative my-7 space-y-3">
            <a href="mailto:towfiqbinhasan@gmail.com" className="group/mail flex items-center gap-3 break-all text-sm sm:text-base text-gray-300 transition-colors duration-300 hover:text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 transition-all duration-300 group-hover/mail:-translate-y-0.5 group-hover/mail:bg-purple-500/20 group-hover/mail:text-purple-200 group-hover/mail:ring-purple-400/40"><FiMail /></span>
              towfiqbinhasan@gmail.com
            </a>
            <div className="flex gap-3 text-lg">
              {[
                { href: "https://github.com/towfiqbinhasan", icon: FaGithub, label: "GitHub" },
                { href: "https://www.linkedin.com/in/md-towfiq-bin-hasan-531ba5265/", icon: FaLinkedin, label: "LinkedIn" },
                { href: "https://wa.me/qr/IHA6ZSEDQZ57M1", icon: FaWhatsapp, label: "WhatsApp" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="btn-press flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-gray-400 ring-1 ring-white/10 hover:bg-purple-500/20 hover:text-white hover:ring-purple-400/40"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
          <div className="relative">
            <ViewDetails href="/contact" label="Contact me" />
          </div>
        </GlowCard>
      </div>
    </section>
  );
}

/* ---------- 09 Explore more ---------- */

const more = [
  { name: "Gadgets", path: "/gadgets", icon: FiCpu, text: "The tech I use every day", color: "from-cyan-500/20" },
  { name: "Tour", path: "/tour", icon: FiMap, text: "Travels across Bangladesh", color: "from-emerald-500/20" },
  { name: "Photography", path: "/photography", icon: FiCamera, text: "Moments through my lens", color: "from-amber-500/20" },
  { name: "Filmography", path: "/filmography", icon: FiFilm, text: "Short films & edits", color: "from-blue-500/20" },
  { name: "Activity", path: "/activity", icon: FiUsers, text: "Clubs, events & volunteering", color: "from-violet-500/20" },
];

export function ExploreMore() {
  return (
    <section className="px-4 sm:px-6 py-12 sm:py-20 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease }}
        className="mb-10 text-center"
      >
        <p className="text-xs uppercase tracking-[0.25em] text-purple-300/80">
          <span className="font-mono text-purple-400">10</span> Beyond code
        </p>
        <h2 className="mt-4 text-[1.75rem] xs:text-3xl sm:text-4xl md:text-5xl font-bold">
          Explore <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">more</span>
        </h2>
      </motion.div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-5">
        {more.map((m, i) => (
          <GlowCard key={m.path} delay={i * 0.08} className="last:col-span-2 md:last:col-span-1">
            <Link href={m.path} className="btn-press relative block h-full p-4 sm:p-5">
              <div aria-hidden className={`absolute inset-0 bg-gradient-to-br ${m.color} to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
              <m.icon className="relative text-2xl text-purple-300 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
              <h3 className="relative mt-4 font-semibold text-white">{m.name}</h3>
              <p className="relative mt-1 text-xs text-gray-500">{m.text}</p>
              <span className="relative mt-4 inline-flex items-center gap-1 text-xs text-purple-300 transition-colors duration-300 group-hover:text-purple-200">
                View details <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </GlowCard>
        ))}
      </div>
    </section>
  );
}
