"use client";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
} from "framer-motion";
import { FaGithub, FaLinkedin, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { FiMail, FiChevronRight, FiArrowUpRight, FiArrowRight, FiDownload } from "react-icons/fi";
import { SKILLS } from "@/lib/skills";
import Link from "next/link";
import Image from "next/image";

/* ---------- 3D cube ---------- */

const CUBIE = 76; // size of one small cube (px)
const STEP = CUBIE + 4; // spacing between cubies
const HALF = CUBIE / 2;
type Coord = { x: number; y: number; z: number };

// For each face: its transform, fake lighting, and which tile (0-8) a cubie
// occupies on that side of the big cube — null when the face is hidden inside.
const FACES: {
  key: string;
  transform: string;
  shade: number;
  tile: (c: Coord) => number | null;
}[] = [
  { key: "front", transform: `translateZ(${HALF}px)`, shade: 0.55, tile: (c) => (c.z === 1 ? (c.y + 1) * 3 + c.x + 1 : null) },
  { key: "right", transform: `rotateY(90deg) translateZ(${HALF}px)`, shade: 0.4, tile: (c) => (c.x === 1 ? (c.y + 1) * 3 + 1 - c.z : null) },
  { key: "back", transform: `rotateY(180deg) translateZ(${HALF}px)`, shade: 0.35, tile: (c) => (c.z === -1 ? (c.y + 1) * 3 + 1 - c.x : null) },
  { key: "left", transform: `rotateY(-90deg) translateZ(${HALF}px)`, shade: 0.5, tile: (c) => (c.x === -1 ? (c.y + 1) * 3 + c.z + 1 : null) },
  { key: "top", transform: `rotateX(90deg) translateZ(${HALF}px)`, shade: 0.8, tile: (c) => (c.y === -1 ? (c.z + 1) * 3 + c.x + 1 : null) },
  { key: "bottom", transform: `rotateX(-90deg) translateZ(${HALF}px)`, shade: 0.2, tile: (c) => (c.y === 1 ? (1 - c.z) * 3 + c.x + 1 : null) },
];

function Cubie({ x, y, z }: Coord) {
  return (
    <div
      className="absolute left-0 top-0"
      style={{
        width: CUBIE,
        height: CUBIE,
        marginLeft: -HALF,
        marginTop: -HALF,
        transformStyle: "preserve-3d",
        transform: `translate3d(${x * STEP}px, ${y * STEP}px, ${z * STEP}px)`,
      }}
    >
      {FACES.map((face, f) => {
        const light = Math.round(16 + face.shade * 30);
        const tile = face.tile({ x, y, z });
        const base = `linear-gradient(145deg, rgb(${light},${light},${light + 3}) 0%, rgb(8,8,10) 100%)`;

        // Faces hidden inside the cube: plain dark plastic.
        if (tile == null) {
          return (
            <div
              key={face.key}
              className="absolute inset-0 rounded-[10px]"
              style={{ transform: face.transform, backfaceVisibility: "hidden", backgroundImage: base }}
            />
          );
        }

        const skill = SKILLS[(f * 9 + tile) % SKILLS.length];
        // Diagonal wave: the shine reaches each tile a moment after its neighbour.
        const delay = ((tile % 3) + Math.floor(tile / 3)) * 0.14 + f * 0.9;

        return (
          <div
            key={face.key}
            className="cube-tile absolute inset-0 rounded-[10px] flex flex-col items-center justify-center gap-1.5"
            style={
              {
                transform: face.transform,
                backfaceVisibility: "hidden",
                backgroundImage: `radial-gradient(circle at 50% 38%, ${skill.color}2e 0%, transparent 62%), ${base}`,
                "--c": skill.color,
                "--d": `${delay}s`,
              } as CSSProperties
            }
          >
            <skill.icon
              className="cube-icon relative z-[1]"
              size={30}
              style={{
                color: skill.color,
                opacity: 0.75 + face.shade * 0.25,
                filter: `drop-shadow(0 0 10px ${skill.color}80)`,
              }}
            />
            <span
              className="relative z-[1] text-[9px] font-semibold tracking-wide text-neutral-200 whitespace-nowrap"
              style={{ opacity: 0.65 + face.shade * 0.35 }}
            >
              {skill.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Layer({ y, angle }: { y: number; angle: number }) {
  const cubies = [];
  for (let x = -1; x <= 1; x++)
    for (let z = -1; z <= 1; z++)
      cubies.push(<Cubie key={`${x}${z}`} x={x} y={y} z={z} />);

  return (
    <motion.div
      className="absolute left-0 top-0"
      style={{ transformStyle: "preserve-3d" }}
      animate={{ rotateY: angle }}
      transition={{ type: "spring", stiffness: 60, damping: 14, mass: 1.2 }}
    >
      {cubies}
    </motion.div>
  );
}

type LayerName = "top" | "middle" | "bottom";

// Scramble the skills, then play the moves backwards so every side returns to its original set.
const SCRAMBLE: [LayerName, number][] = [
  ["top", 90],
  ["bottom", -90],
  ["middle", 180],
  ["top", -90],
  ["bottom", 90],
];
const SEQUENCE: ([LayerName, number] | null)[] = [
  ...SCRAMBLE,
  null, // hold scrambled
  ...[...SCRAMBLE].reverse().map(([l, d]): [LayerName, number] => [l, -d]),
  null, // hold solved
  null,
];

function RubikCube() {
  const reduce = useReducedMotion();
  const [twists, setTwists] = useState<Record<LayerName, number>>({ top: 0, middle: 0, bottom: 0 });

  useEffect(() => {
    if (reduce) return;
    let i = 0;
    const id = setInterval(() => {
      const move = SEQUENCE[i % SEQUENCE.length];
      if (move) {
        const [layer, deg] = move;
        setTwists((t) => ({ ...t, [layer]: t[layer] + deg }));
      }
      i++;
    }, 1500);
    return () => clearInterval(id);
  }, [reduce]);

  // Drag to rotate, with momentum; drifts back into a slow auto-spin when left alone.
  const REST_X = -20;
  const rotX = useMotionValue(REST_X);
  const rotY = useMotionValue(30);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 }); // degrees per frame

  useAnimationFrame((_, delta) => {
    if (dragging.current) return;
    const f = Math.min(delta / 16.7, 3); // normalise to ~60fps
    const v = velocity.current;
    v.x *= Math.pow(0.94, f);
    v.y *= Math.pow(0.94, f);

    const spin = reduce ? 0 : 0.125; // matches the old 48s-per-turn auto-spin
    rotY.set(rotY.get() + (v.y + spin) * f);
    // Once momentum fades, tilt eases back so the logos stay readable.
    const x = rotX.get() + v.x * f;
    rotX.set(Math.abs(v.x) < 0.05 ? x + (REST_X - x) * 0.02 * f : x);
  });

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    velocity.current = { x: 0, y: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    const vy = dx * 0.45;
    const vx = -dy * 0.45;
    velocity.current = { x: vx, y: vy };
    rotY.set(rotY.get() + vy);
    rotX.set(Math.max(-75, Math.min(75, rotX.get() + vx)));
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div
      className="relative w-[380px] h-[380px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-pan-y"
      style={{ perspective: 1400 }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {/* Slowly rotating colour aura behind the cube */}
      <div
        aria-hidden
        className="hero-badge-spin absolute top-1/2 left-1/2 -ml-40 -mt-40 w-80 h-80 rounded-full blur-[90px] opacity-35"
        style={{
          animationDuration: "24s",
          background: "conic-gradient(from 0deg, #8b5cf6, #3b82f6, #22c55e, #f59e0b, #22d3ee, #8b5cf6)",
        }}
      />
      {/* Floor: soft coloured reflection + contact shadow */}
      <div aria-hidden className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-80 h-16 rounded-[100%] bg-gradient-to-r from-violet-500/25 via-cyan-400/20 to-cyan-400/25 blur-2xl" />
      <div aria-hidden className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-8 rounded-[100%] bg-black blur-xl opacity-90" />

      <motion.div
        style={{ transformStyle: "preserve-3d" }}
        animate={reduce ? undefined : { y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}>
          <div className="relative" style={{ transformStyle: "preserve-3d" }}>
            <Layer y={-1} angle={twists.top} />
            <Layer y={0} angle={twists.middle} />
            <Layer y={1} angle={twists.bottom} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ---------- Hero ---------- */

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.9, delay, ease },
});

const HEADLINE = [["Towfiq", "Bin", "Hasan"]];

/** Dimmed pipe between the roles in the subtitle. */
const Sep = () => <span className="mx-1.5 text-neutral-600">|</span>;

const secondaryLinks = [
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

export default function Hero() {
  let wordIndex = 0;

  return (
    <section className="relative -mt-20 pt-20 min-h-screen overflow-hidden bg-[#050505]">
      {/* Spotlight from the top-right */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 75% 20%, rgba(255,255,255,0.09), transparent 70%)",
        }}
      />

      {/* Diagonal light streak sweeping across the bottom */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[-25%] top-[62%] h-40 w-[150%] -rotate-[8deg] blur-3xl"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 35%, rgba(255,255,255,0.12) 55%, transparent 80%)",
        }}
        initial={{ opacity: 0, x: "-20%" }}
        animate={{ opacity: [0, 1, 0.7, 1], x: ["-20%", "10%", "-5%", "-20%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-10%] top-[70%] h-px w-[120%] -rotate-[8deg] bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      {/* Fine grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 md:px-12 min-h-[calc(100vh-5rem)] grid lg:grid-cols-[1.1fr_1fr] items-center gap-8 sm:gap-6 py-12 sm:py-16">
        {/* Left: copy */}
        <div className="order-2 lg:order-1">
          {/* Badge with animated gradient border */}
          <motion.div {...fadeUp(0.1)}>
            <Link
              href="/contact"
              className="group relative inline-flex overflow-hidden rounded-full p-px"
            >
              <span
                className="hero-badge-spin absolute left-1/2 top-1/2 aspect-square w-[250%] -translate-x-1/2 -translate-y-1/2"
                style={{
                  background:
                    "conic-gradient(from 0deg, #14b8a6, #8b5cf6, #22d3ee, #14b8a6)",
                }}
              />
              <span className="relative inline-flex items-center gap-2 sm:gap-2.5 rounded-full bg-[#0b0b0d] py-1.5 pl-1.5 pr-3.5 sm:pr-4 text-xs sm:text-sm text-gray-200">
                <span className="relative h-7 w-7 overflow-hidden rounded-full ring-1 ring-white/15">
                  <Image src="/DSC00106.jpg" alt="Towfiq Bin Hasan" fill sizes="28px" className="object-cover" priority />
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Open to Collaboration
                <FiChevronRight className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </motion.div>

          {/* Headline: word-by-word blur reveal */}
          <h1
            className="mt-7 whitespace-nowrap text-[clamp(1.6rem,8.6vw,3.6rem)] leading-[1.05] tracking-tight sm:mt-8 lg:text-[clamp(2.6rem,4.7vw,5.2rem)]"
            style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
          >
            {HEADLINE.map((line, li) => (
              <span key={li} className="block pb-2">
                {line.map((word) => {
                  const d = 0.25 + wordIndex++ * 0.12;
                  return (
                    <motion.span
                      key={word}
                      className="inline-block mr-[0.22em] bg-gradient-to-br from-white via-white to-neutral-500 bg-clip-text text-transparent"
                      initial={{ opacity: 0, y: 40, filter: "blur(14px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 1, delay: d, ease }}
                    >
                      {word}
                    </motion.span>
                  );
                })}
              </span>
            ))}
          </h1>

          <motion.p
            {...fadeUp(0.7)}
            className="mt-4 max-w-3xl text-sm sm:text-base md:text-lg leading-relaxed text-neutral-400"
          >
            CS Student <Sep /> Passionate about Web Development &amp; Problem Solving <Sep />{" "}
            Researcher <Sep /> Traveler <Sep /> Photographer <Sep /> Filmmaker
          </motion.p>

          {/* Primary actions */}
          <motion.div {...fadeUp(0.85)} className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Filled gradient button with a light sweep on hover */}
            <Link
              href="/projects"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-400 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_32px_-12px_rgba(168,85,247,0.9)] transition-transform duration-300 hover:-translate-y-0.5 sm:text-base"
            >
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
              <span className="relative">View Projects</span>
              <FiArrowRight className="relative transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            {/* Glass button */}
            <Link
              href="/cv"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-neutral-200 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-400/50 hover:bg-white/[0.08] hover:text-white sm:text-base"
            >
              <FiDownload className="transition-transform duration-300 group-hover:translate-y-0.5" />
              Download CV
            </Link>
          </motion.div>

          {/* Quick links */}
          <motion.div {...fadeUp(1)} className="mt-8 flex flex-wrap items-center gap-2">
            {secondaryLinks.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.05 + i * 0.07, ease }}
              >
                <Link
                  href={l.href}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-1.5 text-xs text-neutral-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-400/40 hover:bg-purple-500/10 hover:text-white sm:text-sm"
                >
                  {l.label}
                  <FiArrowUpRight className="text-[0.9em] opacity-0 transition-all duration-300 group-hover:opacity-100" />
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Socials */}
          <motion.div {...fadeUp(1.15)} className="mt-7 flex items-center gap-3">
            <span aria-hidden className="h-px w-8 bg-gradient-to-r from-purple-400/60 to-transparent" />
            {socials.map(({ href, icon: Icon, label, color }, i) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                title={label}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, delay: 1.2 + i * 0.07, ease }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.92 }}
                style={{ "--sc": color } as CSSProperties}
                className="social-orb flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-lg text-neutral-400 backdrop-blur sm:h-11 sm:w-11"
              >
                <Icon />
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Right: cube */}
        <motion.div
          className="order-1 lg:order-2 flex justify-center lg:justify-end"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.2, ease }}
        >
          <div className="relative h-[228px] w-[228px] xs:h-[266px] xs:w-[266px] sm:h-[300px] sm:w-[300px] lg:h-[380px] lg:w-[380px]">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.6] xs:scale-[0.7] sm:scale-[0.79] lg:scale-100">
              <RubikCube />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fade into the next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#0a0a0f]" />
    </section>
  );
}
