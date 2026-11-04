"use client";
import { useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, animate, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { gsap, MQ } from "@/lib/gsap";
import SkillsRing from "@/components/SkillsRing";
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
  FiX,
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
        style={{ background: "conic-gradient(from 0deg, transparent 0 60%, #2f7bff, #4fc3ff, transparent 90%)" }}
      />
      <span className="btn-shine relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/10 bg-[#0c162c] px-5 py-2.5 text-sm font-medium text-white">
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
          className={`flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-sky-300/80 ${center ? "justify-center" : ""}`}
        >
          <span className="font-mono text-sky-400">{index}</span>
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="h-px w-10 origin-left bg-gradient-to-r from-sky-400 to-cyan-400"
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
          <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">{accent}</span>
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
  world,
  children,
}: {
  index: string;
  eyebrow: string;
  title: string;
  accent: string;
  text: string;
  href: string;
  /** Stop name for the home 3D world (see World3D). */
  world?: string;
  children: ReactNode;
}) {
  return (
    <section data-world={world} className="relative px-4 sm:px-6 py-12 sm:py-20 max-w-6xl mx-auto">
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
  plain = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Skip the built-in fade-up, for cards whose entrance is scroll-driven by GSAP. */
  plain?: boolean;
}) {
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <motion.div
      onMouseMove={onMove}
      {...(plain
        ? {}
        : {
            // Same 3D swing-up entrance as the cards on the other pages
            initial: { opacity: 0, y: 70, rotateX: 28, scale: 0.94, transformPerspective: 1000 },
            whileInView: { opacity: 1, y: 0, rotateX: 0, scale: 1 },
            viewport: { once: true, margin: "-60px" },
            transition: { duration: 0.9, delay, ease },
            style: { transformOrigin: "50% 100%" },
          })}
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
      world="qualification"
    >
      <div className="relative grid gap-5 md:grid-cols-3">
        {/* Connecting line that draws itself */}
        <motion.div
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease }}
          className="absolute left-0 right-0 top-[106px] hidden h-px origin-left bg-gradient-to-r from-sky-500 via-cyan-400 to-transparent md:block"
        />
        {qualifications.map((q, i) => (
          <GlowCard key={q.degree} delay={i * 0.12} className="p-4 sm:p-5">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10">
                <Image src={q.image} alt={q.institute} fill sizes="56px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs text-sky-200 transition-colors duration-500 group-hover:border-sky-400/60 group-hover:bg-sky-500/20 group-hover:text-white">
                <FiCalendar className="transition-transform duration-500 group-hover:scale-110" /> {q.duration}
              </span>
            </div>
            <div className="relative mt-6 h-3 w-3 rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 shadow-[0_0_12px_rgba(79,195,255,0.8)] transition-transform duration-500 group-hover:scale-150" />
            <h3 className="mt-5 font-semibold text-white leading-snug">{q.degree}</h3>
            <p className="mt-1 text-sm text-sky-300/90">{q.major}</p>
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
      world="experience"
    >
      <Timeline>
        {items.map((e, i) => {
          const current = /present/i.test(e.duration);
          return (
            <div
              key={`${e.id ?? e.company}-${i}`}
              className={`timeline-item relative pl-10 md:w-1/2 md:pl-0 ${i % 2 ? "md:ml-auto md:pl-12" : "md:pr-12"}`}
            >
              {/* Dot on the line */}
              <span
                aria-hidden
                className={`absolute left-[11px] top-8 h-3 w-3 rotate-45 bg-sky-500 shadow-[0_0_14px_rgba(47,123,255,0.9)] ${i % 2 ? "md:-left-1.5" : "md:left-auto md:-right-1.5"}`}
              />
              <GlowCard plain className="p-4 sm:p-6">
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
                    <p className="mt-0.5 text-sm text-sky-300">{e.company}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1.5"><FiBriefcase /> {e.employmentType}</span>
                      <span className="inline-flex items-center gap-1.5"><FiCalendar /> {e.duration}</span>
                      {e.location && <span className="inline-flex items-center gap-1.5"><FiMapPin /> {e.location}</span>}
                    </div>
                  </div>
                </div>
              </GlowCard>
            </div>
          );
        })}
      </Timeline>
    </Section>
  );
}

/** Vertical line that draws itself with scroll; items swing in from alternating sides. */
function Timeline({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MQ.motion, () => {
      gsap.fromTo(
        ".timeline-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom 60%", scrub: true },
        }
      );
      // Phones: a short slide, so cards entering from the right never stick out past the screen
      const shift = window.matchMedia("(max-width: 767px)").matches ? 24 : 80;
      gsap.utils.toArray<HTMLElement>(".timeline-item", root.current).forEach((item, i) => {
        gsap.from(item, {
          x: i % 2 ? shift : -shift,
          rotation: i % 2 ? 4 : -4,
          autoAlpha: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 85%", toggleActions: "play none none reverse" },
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={root} className="relative space-y-6 overflow-x-clip md:space-y-10">
      <span aria-hidden className="absolute bottom-0 left-4 top-0 w-px bg-white/10 md:left-1/2" />
      <span
        aria-hidden
        className="timeline-line absolute bottom-0 left-4 top-0 w-px origin-top bg-gradient-to-b from-sky-500 via-sky-500 to-transparent md:left-1/2"
      />
      {children}
    </div>
  );
}

/* ---------- 03 Skills ---------- */

function SkillRow({ reverse = false }: { reverse?: boolean }) {
  const list = reverse ? [...SKILLS].reverse() : SKILLS;
  return (
    <div className="marquee group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
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
      world="skills"
    >
      <SkillsRing />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease }}
        // Breaks out of the centred column so the rows run edge to edge of the screen
        className="relative mt-12 ml-[calc(50%-50vw)] w-screen space-y-3"
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
  const items = all.slice(0, 6);
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<Project | null>(null);
  const close = useCallback(() => setOpen(null), []);
  // Phones: which card is centred in the swipe row, and whether the visitor has swiped yet.
  const [active, setActive] = useState(0);
  const [swiped, setSwiped] = useState(false);

  const cards = () => Array.from(track.current?.children ?? []) as HTMLElement[];
  const onRowScroll = () => {
    const vp = viewport.current;
    if (!vp || window.innerWidth >= 768) return;
    const mid = vp.scrollLeft + vp.clientWidth / 2;
    let best = 0;
    cards().forEach((c, i) => {
      const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
      if (d < Math.abs(cards()[best].offsetLeft + cards()[best].offsetWidth / 2 - mid)) best = i;
    });
    setActive(best);
    if (vp.scrollLeft > 8) setSwiped(true);
  };
  const goTo = (i: number) => {
    const vp = viewport.current;
    const c = cards()[Math.max(0, Math.min(i, items.length - 1))];
    if (vp && c) vp.scrollTo({ left: c.offsetLeft - (vp.clientWidth - c.offsetWidth) / 2, behavior: "smooth" });
  };

  useEffect(() => {
    const mm = gsap.matchMedia(root);

    // Desktop: pin, and let vertical scroll slide the cards sideways.
    mm.add(MQ.desktop, () => {
      const distance = () => (track.current?.scrollWidth ?? 0) - (viewport.current?.clientWidth ?? 0);
      const slide = gsap.to(track.current, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      // Each card swings in tilted and straightens as it reaches the middle.
      gsap.utils.toArray<HTMLElement>(".project-tilt", track.current).forEach((card) => {
        gsap.fromTo(
          card,
          { rotationY: -28, transformPerspective: 1200 },
          {
            rotationY: 0,
            ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: slide, start: "left right", end: "center 55%", scrub: true },
          }
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} data-world="projects" className="relative overflow-hidden">
      <div className="mx-auto flex max-w-6xl flex-col justify-center px-4 py-12 sm:px-6 sm:py-20 md:min-h-screen">
        <SectionHeading
          index="04"
          eyebrow="Work"
          title="Featured"
          accent="Projects"
          text={`${all.length} projects: full-stack web apps, desktop software and data-driven research.`}
          href="/projects"
        />

        {/* Phones: a swipe carousel, cards centred with their neighbours peeking in.
            Desktop: the row is moved sideways by GSAP while the section is pinned. */}
        <div className="relative md:static">
          {!swiped && (
            <span className="pointer-events-none absolute -top-7 right-0 z-10 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-sky-300 md:hidden">
              Swipe
              <motion.span animate={{ x: [0, 6, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}>
                <FiArrowRight />
              </motion.span>
            </span>
          )}
        <div
          ref={viewport}
          onScroll={onRowScroll}
          className="scrollbar-hide -mx-4 snap-x snap-mandatory overflow-x-auto px-[9vw] pb-2 sm:-mx-6 md:mx-0 md:snap-none md:overflow-visible md:px-0 md:pb-0"
        >
          <div ref={track} className="flex w-max gap-4 will-change-transform md:gap-5">
            {items.map((p, i) => (
              <button
                key={p.title}
                type="button"
                data-cursor="View"
                onClick={() => setOpen(p)}
                aria-label={`${p.title}, project ${i + 1} of ${items.length}`}
                className={`project-tilt block w-[82vw] max-w-[380px] shrink-0 snap-center text-left transition-[transform,opacity] duration-500 md:w-[380px] md:transition-none ${
                  i === active ? "" : "max-md:scale-[0.92] max-md:opacity-50"
                }`}
              >
                <GlowCard plain className="flex h-full flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {p.images?.[0] && (
                      <Image
                        src={p.images[0]}
                        alt={p.title}
                        fill
                        sizes="380px"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050b1a] via-[#050b1a]/20 to-transparent" />
                    <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-sky-200 backdrop-blur ring-1 ring-white/10 transition-all duration-500 group-hover:bg-sky-500/40 group-hover:text-white group-hover:ring-sky-400/50">
                      {p.field}
                    </span>
                    <span className="absolute bottom-2 right-4 font-[family-name:var(--font-heading)] text-5xl text-white/15">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <h3 className="font-semibold text-white leading-snug line-clamp-2">{p.title}</h3>
                    <p className="mt-2 text-sm text-gray-400 line-clamp-2">{p.desc}</p>
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                      {p.tech.slice(0, 4).map((t) => (
                        <span key={t} className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-gray-300 ring-1 ring-white/10">
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-sky-300 md:hidden">
                      Tap to view <FiArrowUpRight />
                    </span>
                  </div>
                </GlowCard>
              </button>
            ))}
          </div>
        </div>
        </div>

        {/* Phone controls: arrows, dots and a counter */}
        <div className="mt-6 flex items-center justify-between gap-4 md:hidden">
          <button
            type="button"
            aria-label="Previous project"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            className="btn-press flex h-11 w-11 shrink-0 items-center justify-center border border-white/15 bg-white/5 text-lg text-white disabled:opacity-30"
          >
            <FiArrowRight className="rotate-180" />
          </button>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              {items.map((p, i) => (
                <button
                  key={p.title}
                  type="button"
                  aria-label={`Go to project ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`h-1.5 transition-all duration-300 ${i === active ? "w-6 bg-sky-500" : "w-1.5 bg-white/25"}`}
                />
              ))}
            </div>
            <span className="font-[family-name:var(--font-heading)] text-sm tracking-widest text-white">
              {String(active + 1).padStart(2, "0")} <span className="text-white/35">/ {String(items.length).padStart(2, "0")}</span>
            </span>
          </div>
          <button
            type="button"
            aria-label="Next project"
            onClick={() => goTo(active + 1)}
            disabled={active === items.length - 1}
            className="btn-press flex h-11 w-11 shrink-0 items-center justify-center border border-white/15 bg-white/5 text-lg text-white disabled:opacity-30"
          >
            <FiArrowRight />
          </button>
        </div>

        <div className="mt-8 flex justify-center md:hidden">
          <ViewDetails href="/projects" label="All projects" />
        </div>
      </div>

      <ProjectOverlay project={open} onClose={close} />
    </section>
  );
}

/** Quick look at a project, opened from the home gallery. */
function ProjectOverlay({ project, onClose }: { project: Project | null; onClose: () => void }) {
  // Pause smooth scrolling and listen for Escape while open.
  useEffect(() => {
    if (!project) return;
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  // Rendered on <body>: the gallery is pinned, and a transformed ancestor would trap position: fixed.
  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          key="overlay"
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ y: 60, scale: 0.94, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 40, scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.6, ease }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl overflow-hidden border border-sky-500/40 bg-[#0a1428] shadow-[0_0_80px_-20px_rgba(47,123,255,0.6)]"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="btn-press absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center bg-black/60 text-xl text-white ring-1 ring-white/15 hover:bg-sky-500"
            >
              <FiX />
            </button>
            {project.images?.[0] && (
              <div className="relative aspect-[16/9]">
                <Image src={project.images[0]} alt={project.title} fill sizes="768px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1428] to-transparent" />
              </div>
            )}
            <div className="p-6 sm:p-8">
              <span className="text-xs uppercase tracking-[0.25em] text-sky-400">{project.field}</span>
              <h3 className="mt-2 font-[family-name:var(--font-heading)] text-3xl uppercase text-white sm:text-4xl">{project.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-gray-300 sm:text-base">{project.desc}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span key={t} className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-gray-300 ring-1 ring-white/10">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-7">
                <ViewDetails href="/projects" label="All projects" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
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
      world="research"
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_2fr]">
        <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 sm:gap-4">
          {stats.map((s, i) => (
            <GlowCard key={s.label} delay={i * 0.1} className="p-3 sm:p-5 text-center lg:text-left">
              <div className="origin-center text-3xl xs:text-4xl sm:text-5xl font-bold bg-gradient-to-br from-white to-sky-300 bg-clip-text text-transparent transition-transform duration-500 group-hover:scale-105 lg:origin-left">
                <CountUp to={s.value} />
              </div>
              <p className="mt-1 text-[11px] leading-tight sm:text-sm text-gray-400 transition-colors duration-500 group-hover:text-sky-200">{s.label}</p>
              <span
                aria-hidden
                className="mx-auto mt-2 block h-px w-6 bg-gradient-to-r from-sky-400 to-cyan-400 transition-all duration-500 group-hover:w-12 lg:mx-0"
              />
            </GlowCard>
          ))}
        </div>
        <div className="space-y-3">
          {papers.slice(0, 3).map((p, i) => (
            <GlowCard key={p.title} delay={0.15 + i * 0.1} className="p-5">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-cyan-400/20 text-sky-200 ring-1 ring-sky-400/30 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 group-hover:ring-sky-400/60">
                  <FiFileText />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-white leading-snug line-clamp-2">{p.title}</h3>
                  <p className="mt-1.5 text-xs text-gray-500">
                    <span className="text-sky-300">{p.year}</span> · {p.conferenceName}
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

/** Pulls its child slightly toward the cursor, then springs back when it leaves. */
function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * strength);
      y((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);

  return (
    <div ref={ref} className="inline-block p-3 -m-3">
      {children}
    </div>
  );
}

/** Huge words running endlessly across the page, ahead of the contact cards. */
function ContactMarquee() {
  const words = (
    <span className="flex shrink-0 items-center gap-8 pr-8">
      <span>Let&apos;s work together</span>
      <span className="text-sky-500">✦</span>
      <span className="text-outline">Let&apos;s connect</span>
      <span className="text-sky-500">✦</span>
    </span>
  );
  return (
    <div aria-hidden className="relative overflow-hidden border-y border-white/10 py-6 sm:py-8">
      <div className="flex w-max font-[family-name:var(--font-heading)] text-[clamp(3rem,10vw,8rem)] uppercase leading-none text-white">
        {[0, 1].map((copy) => (
          <div key={copy} className="big-marquee-track flex shrink-0">
            {words}
            {words}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CvContactPreview() {
  return (
    <>
    <ContactMarquee />
    <section data-world="contact" className="px-4 sm:px-6 py-12 sm:py-20 max-w-6xl mx-auto">
      <div className="grid gap-5 md:grid-cols-2">
        <GlowCard className="p-6 sm:p-9">
          <div aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky-600/20 blur-3xl" />
          <p className="relative flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-sky-300/80">
            <span className="font-mono text-sky-400">08</span> Resume
          </p>
          <h2 className="relative mt-4 text-2xl xs:text-3xl sm:text-4xl font-bold">
            Download my <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">CV</span>
          </h2>
          <p className="relative mt-3 text-gray-400 leading-relaxed">
            CVs tailored for different roles, each with a photo and a Harvard-style version. Request one and get a secure link by email.
          </p>
          <motion.div
            aria-hidden
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative my-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-2xl text-white shadow-lg shadow-sky-500/40"
          >
            <FiDownload />
          </motion.div>
          <div className="relative">
            <Magnetic>
              <ViewDetails href="/cv" label="Request CV" />
            </Magnetic>
          </div>
        </GlowCard>

        <GlowCard delay={0.12} className="p-6 sm:p-9">
          <div aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />
          <p className="relative flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-sky-300/80">
            <span className="font-mono text-sky-400">09</span> Say hello
          </p>
          <h2 className="relative mt-4 text-2xl xs:text-3xl sm:text-4xl font-bold">
            Let&apos;s <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">connect</span>
          </h2>
          <p className="relative mt-3 text-gray-400 leading-relaxed">
            Have a project, a job opportunity or a research idea? My inbox is always open.
          </p>
          <div className="relative my-7 space-y-3">
            <a href="mailto:towfiqbinhasan@gmail.com" className="group/mail flex items-center gap-3 break-all text-sm sm:text-base text-gray-300 transition-colors duration-300 hover:text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 transition-all duration-300 group-hover/mail:-translate-y-0.5 group-hover/mail:bg-sky-500/20 group-hover/mail:text-sky-200 group-hover/mail:ring-sky-400/40"><FiMail /></span>
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
                  className="btn-press flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-gray-400 ring-1 ring-white/10 hover:bg-sky-500/20 hover:text-white hover:ring-sky-400/40"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
          <div className="relative">
            <Magnetic>
              <ViewDetails href="/contact" label="Contact me" />
            </Magnetic>
          </div>
        </GlowCard>
      </div>
    </section>
    </>
  );
}

/* ---------- 09 Explore more ---------- */

const more = [
  { name: "Gadgets", path: "/gadgets", icon: FiCpu, text: "The tech I use every day", color: "from-cyan-500/20" },
  { name: "Tour", path: "/tour", icon: FiMap, text: "Travels across Bangladesh", color: "from-emerald-500/20" },
  { name: "Photography", path: "/photography", icon: FiCamera, text: "Moments through my lens", color: "from-amber-500/20" },
  { name: "Filmography", path: "/filmography", icon: FiFilm, text: "Short films & edits", color: "from-blue-500/20" },
  { name: "Activity", path: "/activity", icon: FiUsers, text: "Clubs, events & volunteering", color: "from-blue-500/20" },
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
        <p className="text-xs uppercase tracking-[0.25em] text-sky-300/80">
          <span className="font-mono text-sky-400">10</span> Beyond code
        </p>
        <h2 className="mt-4 text-[1.75rem] xs:text-3xl sm:text-4xl md:text-5xl font-bold">
          Explore <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">more</span>
        </h2>
      </motion.div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-5">
        {more.map((m, i) => (
          <GlowCard key={m.path} delay={i * 0.08} className="last:col-span-2 md:last:col-span-1">
            <Link href={m.path} className="btn-press relative block h-full p-4 sm:p-5">
              <div aria-hidden className={`absolute inset-0 bg-gradient-to-br ${m.color} to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
              <m.icon className="relative text-2xl text-sky-300 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
              <h3 className="relative mt-4 font-semibold text-white">{m.name}</h3>
              <p className="relative mt-1 text-xs text-gray-500">{m.text}</p>
              <span className="relative mt-4 inline-flex items-center gap-1 text-xs text-sky-300 transition-colors duration-300 group-hover:text-sky-200">
                View details <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </GlowCard>
        ))}
      </div>
    </section>
  );
}
