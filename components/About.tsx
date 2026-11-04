"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { gsap } from "@/lib/gsap";

gsap.registerPlugin(ScrambleTextPlugin);

/*
 * Profile: as the visitor scrolls, the portrait is "scanned" in top to bottom and the
 * profile builds itself: each field decodes out of scrambled characters, the bio lights
 * up word by word and the stats count up.
 *   Large screens: the section pins and the whole build is tied to the scroll (scrub).
 *   Phones / short screens: no pin; the build plays once when the section comes into view.
 *   Reduced motion: everything is rendered final, nothing animates.
 * The section opts out of the site-wide TextReveal (data-no-reveal) since it animates itself.
 */

const FIELDS: { key: string; value: string }[] = [
  { key: "name", value: "Md. Towfiq Bin Hasan" },
  { key: "role", value: "Full Stack Developer · ML Engineer" },
  { key: "study", value: "B.Sc. CSE (Data Science), AIUB" },
  { key: "focus", value: "Machine Learning · Data Mining · Research" },
  { key: "code", value: "C++ · Java · C# · Python · JavaScript" },
  { key: "speaks", value: "English · Bengali · Hindi" },
  { key: "beyond", value: "Traveler (TH Team) · Photography · Film" },
  { key: "status", value: "Open to new opportunities" },
];

const PARAGRAPHS = [
  "I am a meticulous computer science and engineering student at AIUB, majoring in data science. I have a strong passion for my field, particularly in machine learning, data mining, and research. My technical expertise includes C++, Java, C#, and full-stack web development, along with a solid understanding of DSA and database management. I have also participated in several academic conferences and have shared my projects on GitHub.",
  "Beyond my technical life, I am an adventurous traveler. I have a dream of going on a world tour, and I have already successfully traveled across all of Bangladesh with my travel group, TH Team. My experience as a traveler has made me a more adaptable and fast learner. With a mix of strong analytical skills, teaching experience, and a motivated mindset, I am eager to bring my technical knowledge into a professional environment.",
];

const STATS = [
  { value: 14, suffix: "+", label: "Projects" },
  { value: 5, suffix: "", label: "Papers" },
  { value: 2, suffix: "", label: "Internships" },
  { value: 3, suffix: "", label: "Languages" },
];

/** Pin + scrub only where the whole profile fits on one screen. */
const PIN_MQ = "(min-width: 1024px) and (min-height: 840px) and (prefers-reduced-motion: no-preference)";
const PLAY_MQ =
  "(max-width: 1023px) and (prefers-reduced-motion: no-preference), (max-height: 839px) and (prefers-reduced-motion: no-preference)";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*<>/";

/** One span per word so the build can light them up in sequence. */
function Words({ text }: { text: string }) {
  return text.split(" ").map((w, i) => (
    <span key={i} className="reveal-word">
      {w}{" "}
    </span>
  ));
}

export default function About() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia(el);

    /** The whole build as one timeline (about 10 units long). */
    const build = (tl: gsap.core.Timeline, scrubbed: boolean) => {
      const scan = { p: 0 };
      const pct = q(".pf-pct")[0];
      const status = q(".pf-status")[0];
      const values = q<HTMLElement>(".pf-value");
      const nums = q<HTMLElement>(".pf-num");

      // Start state
      gsap.set(q(".pf-img"), { clipPath: "inset(0% 0% 100% 0%)", filter: "grayscale(1) brightness(0.6)", scale: 1.12 });
      gsap.set(q(".pf-grid"), { opacity: 1 });
      gsap.set(q(".pf-scanline"), { top: "0%", opacity: 1 });
      gsap.set(q(".pf-corner"), { scale: 0, opacity: 0 });
      gsap.set(q(".pf-badge"), { opacity: 0, y: 12 });
      gsap.set(q(".pf-head"), { opacity: 0, y: 20 });
      gsap.set(q(".pf-row"), { opacity: 0, x: 24 });
      gsap.set(values, { textContent: "" });
      gsap.set(q(".reveal-word"), { opacity: 0.12 });
      gsap.set(q(".pf-stat"), { opacity: 0, y: 18 });
      gsap.set(nums, { textContent: "0" });
      gsap.set(q(".pf-bar"), { scaleX: 0 });
      if (status) status.textContent = "SCANNING";

      // Portrait scan
      tl.to(q(".pf-corner"), { scale: 1, opacity: 1, duration: 0.6, stagger: 0.08, ease: "back.out(2)" }, 0)
        .to(q(".pf-head"), { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0)
        .to(q(".pf-img"), { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 2.4, ease: "none" }, 0.2)
        .to(q(".pf-scanline"), { top: "100%", duration: 2.4, ease: "none" }, 0.2)
        .to(
          scan,
          {
            p: 100,
            duration: 2.4,
            ease: "none",
            onUpdate: () => {
              if (pct) pct.textContent = `${Math.round(scan.p)}%`;
              if (status) status.textContent = scan.p >= 100 ? "VERIFIED" : "SCANNING";
            },
          },
          0.2
        )
        .to(q(".pf-scanline"), { opacity: 0, duration: 0.3 }, 2.6)
        .to(q(".pf-grid"), { opacity: 0, duration: 0.6 }, 2.6)
        .to(q(".pf-img"), { filter: "grayscale(0) brightness(1)", duration: 0.8 }, 2.6)
        .to(q(".pf-badge"), { opacity: 1, y: 0, duration: 0.5, ease: "back.out(2)" }, 2.9);

      // Fields decode one after another
      q<HTMLElement>(".pf-row").forEach((row, i) => {
        const at = 0.9 + i * 0.45;
        tl.to(row, { opacity: 1, x: 0, duration: 0.4, ease: "power3.out" }, at).to(
          values[i],
          {
            duration: 0.9,
            scrambleText: { text: FIELDS[i].value, chars: SCRAMBLE_CHARS, speed: 0.6, revealDelay: 0.25 },
            ease: "none",
          },
          at
        );
      });

      // Bio lights up word by word, then the stats count up
      tl.to(q(".reveal-word"), { opacity: 1, duration: 2.6, stagger: { amount: 2.4 }, ease: "none" }, 4.6);
      q<HTMLElement>(".pf-stat").forEach((s, i) => {
        const n = { v: 0 };
        const at = 7.4 + i * 0.2;
        tl.to(s, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, at).to(
          n,
          {
            v: STATS[i].value,
            duration: 0.9,
            ease: "power2.out",
            onUpdate: () => {
              nums[i].textContent = String(Math.round(n.v));
            },
          },
          at
        );
      });

      // Progress bar runs across the whole build
      tl.to(q(".pf-bar"), { scaleX: 1, duration: tl.duration(), ease: "none" }, 0);
      if (scrubbed) tl.to({}, { duration: 0.6 }); // a short hold at the end before the pin releases
    };

    mm.add(PIN_MQ, () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 2}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      build(tl, true);
    });

    mm.add(PLAY_MQ, () => {
      const tl = gsap.timeline({
        paused: true,
        scrollTrigger: { trigger: stage.current, start: "top 70%", once: true },
      });
      build(tl, false);
      tl.timeScale(1.6);
    });

    // Portrait tilts toward the pointer
    mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const c = card.current;
      if (!c) return;
      const rx = gsap.quickTo(c, "rotationX", { duration: 0.8, ease: "power3.out" });
      const ry = gsap.quickTo(c, "rotationY", { duration: 0.8, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const r = c.getBoundingClientRect();
        rx(((e.clientY - r.top) / r.height - 0.5) * -10);
        ry(((e.clientX - r.left) / r.width - 0.5) * 12);
      };
      const leave = () => {
        rx(0);
        ry(0);
      };
      c.addEventListener("pointermove", move);
      c.addEventListener("pointerleave", leave);
      return () => {
        c.removeEventListener("pointermove", move);
        c.removeEventListener("pointerleave", leave);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} data-world="about" data-no-reveal className="relative">
      <div
        ref={stage}
        className="relative mx-auto flex max-w-6xl items-center px-4 py-14 sm:px-6 sm:py-20 lg:min-h-screen lg:pb-6 lg:pt-20"
      >
        {/* Soft spotlight behind the block */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(ellipse 55% 60% at 28% 45%, rgba(47,123,255,0.12), transparent 70%)" }}
        />

        <div className="grid w-full items-center gap-10 md:grid-cols-[minmax(0,340px)_1fr] md:gap-12 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-14">
          {/* ---------- Portrait ---------- */}
          <div className="relative mx-auto w-full max-w-[300px] [perspective:1000px] sm:max-w-[340px] md:max-w-none">
            <span aria-hidden className="absolute -inset-8 rounded-full bg-blue-600/15 blur-3xl" />
            <div
              ref={card}
              className="relative aspect-[4/5] [transform-style:preserve-3d] will-change-transform"
            >
              {/* Glowing frame */}
              <div className="absolute inset-0 overflow-hidden rounded-[28px] border border-sky-400/40 bg-[#070e20] shadow-[0_0_40px_-10px_rgba(61,147,255,0.6),inset_0_0_30px_rgba(61,147,255,0.08)]">
                <div className="pf-img absolute inset-0">
                  <Image
                    src="/DSC00106.jpg"
                    alt="Towfiq Bin Hasan"
                    fill
                    sizes="(max-width: 768px) 340px, 380px"
                    className="object-cover object-[55%_30%]"
                  />
                </div>
                {/* Scan grid (fades once the scan completes) */}
                <span
                  aria-hidden
                  className="pf-grid pointer-events-none absolute inset-0 opacity-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(79,195,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(79,195,255,0.18) 1px, transparent 1px)",
                    backgroundSize: "22px 22px",
                  }}
                />
                {/* Scan line */}
                <span
                  aria-hidden
                  className="pf-scanline pointer-events-none absolute inset-x-0 top-full h-[2px] -translate-y-1/2 bg-cyan-300 opacity-0 shadow-[0_0_16px_4px_rgba(79,195,255,0.7)]"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050b1a]/85 via-transparent to-transparent"
                />
                {/* Caption */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 font-mono text-[10px] uppercase tracking-[0.2em] text-sky-200/80 sm:p-5">
                  <span>
                    <span className="pf-status text-cyan-300">Verified</span>
                    <span className="mx-1.5 text-sky-400/50">/</span>
                    <span className="pf-pct">100%</span>
                  </span>
                  <span className="text-right">ID · TBH-01</span>
                </div>
              </div>

              {/* HUD corner brackets */}
              {[
                "left-[-6px] top-[-6px] border-l-2 border-t-2 rounded-tl-xl",
                "right-[-6px] top-[-6px] border-r-2 border-t-2 rounded-tr-xl",
                "bottom-[-6px] left-[-6px] border-b-2 border-l-2 rounded-bl-xl",
                "bottom-[-6px] right-[-6px] border-b-2 border-r-2 rounded-br-xl",
              ].map((pos) => (
                <span key={pos} aria-hidden className={`pf-corner absolute h-7 w-7 border-cyan-300 ${pos}`} />
              ))}

              {/* Floating badge */}
              <div className="pf-badge absolute -right-3 top-6 flex items-center gap-2 rounded-full border border-emerald-400/40 bg-[#0a1428]/85 px-3 py-1.5 text-[11px] font-semibold text-emerald-300 shadow-[0_0_20px_-6px_rgba(52,211,153,0.7)] backdrop-blur-md [transform:translateZ(40px)] sm:-right-5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                Profile loaded
              </div>
            </div>
          </div>

          {/* ---------- Generated profile ---------- */}
          <div className="min-w-0">
            <div className="pf-head">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-sky-300/80">
                <span className="font-mono text-sky-400">00</span>
                <span className="h-px w-10 bg-gradient-to-r from-sky-400 to-cyan-400" />
                Introduction
              </div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                About{" "}
                <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">Me</span>
              </h2>
              <div className="mt-4 flex items-center gap-3 font-mono text-[11px] text-sky-300/80">
                <span className="text-cyan-300">&gt;</span>
                profile.generate()
                <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-sky-400/15">
                  <span className="pf-bar absolute inset-0 origin-left rounded-full bg-gradient-to-r from-sky-500 to-cyan-300" />
                </span>
              </div>
            </div>

            {/* Fields */}
            <dl className="mt-5 grid gap-x-6 gap-y-2.5 rounded-2xl border border-sky-400/25 bg-[#0a1428]/60 p-4 backdrop-blur-md sm:grid-cols-2 sm:p-5">
              {FIELDS.map((f) => (
                <div key={f.key} className="pf-row flex min-w-0 items-baseline gap-3 border-b border-sky-400/10 pb-2">
                  <dt className="w-14 shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-sky-400/80">{f.key}</dt>
                  <dd className="pf-value min-w-0 text-[13px] font-medium leading-snug text-white">{f.value}</dd>
                </div>
              ))}
            </dl>

            {/* Bio */}
            <div className="relative mt-5 space-y-3 border-l border-white/10 pl-5 text-[13px] leading-[1.8] text-white sm:text-sm">
              <span aria-hidden className="absolute left-0 top-0 h-14 w-px bg-gradient-to-b from-sky-400 to-cyan-400" />
              {PARAGRAPHS.map((p) => (
                <p key={p.slice(0, 12)}>
                  <Words text={p} />
                </p>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-3">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="pf-stat rounded-xl border border-sky-400/25 bg-[#0a1428]/60 px-2 py-2.5 text-center sm:py-3"
                >
                  <p className="text-xl font-bold text-white sm:text-2xl">
                    <span className="pf-num">{s.value}</span>
                    <span className="text-sky-400">{s.suffix}</span>
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-sky-300/70 sm:text-[11px]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
