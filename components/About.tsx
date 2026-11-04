"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap, MQ } from "@/lib/gsap";

const ease = [0.22, 1, 0.36, 1] as const;

const PARAGRAPHS = [
  "I am a meticulous computer science and engineering student at AIUB, majoring in data science. I have a strong passion for my field, particularly in machine learning, data mining, and research. My technical expertise includes C++, Java, C#, and full-stack web development, along with a solid understanding of DSA and database management. I have also participated in several academic conferences and have shared my projects on GitHub.",
  "Beyond my technical life, I am an adventurous traveler. I have a dream of going on a world tour, and I have already successfully traveled across all of Bangladesh with my travel group, TH Team. My experience as a traveler has made me a more adaptable and fast learner. With a mix of strong analytical skills, teaching experience, and a motivated mindset, I am eager to bring my technical knowledge into a professional environment.",
];

/** One span per word so scroll can light them up in sequence. */
function Words({ text }: { text: string }) {
  return text.split(" ").map((w, i) => (
    <span key={i} className="reveal-word">
      {w}{" "}
    </span>
  ));
}

export default function About() {
  const root = useRef<HTMLElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MQ.motion, () => {
      // Words go from dim to full white as the text scrolls up the screen.
      gsap.to(gsap.utils.toArray(".reveal-word", copy.current), {
        opacity: 1,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: { trigger: copy.current, start: "top 80%", end: "bottom 45%", scrub: true },
      });
      // Portrait wipes open from the bottom, then drifts slightly slower than the page.
      gsap.fromTo(
        photo.current,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: photo.current, start: "top 80%", toggleActions: "play none none reverse" },
        }
      );
      gsap.fromTo(
        ".about-parallax",
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} data-world="about" className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-24">
      {/* Soft spotlight behind the block */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 30% 40%, rgba(47,123,255,0.10), transparent 70%)",
        }}
      />

      <div className="grid items-center gap-10 md:grid-cols-[minmax(0,320px)_1fr] md:gap-14">
        {/* Portrait */}
        <div
          ref={photo}
          className="relative mx-auto w-full max-w-[260px] sm:max-w-[300px] md:max-w-none"
        >
          {/* Blue glow + spinning neon ring */}
          <span aria-hidden className="absolute -inset-6 rounded-full bg-blue-600/10 blur-3xl" />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative aspect-square"
          >
            <motion.span
              aria-hidden
              className="absolute -inset-1 rounded-full"
              style={{
                background: "conic-gradient(from 200deg, #2f7bff, #1a47b8, #4fc3ff, #2f7bff)",
                boxShadow: "0 0 12px rgba(61,147,255,0.3), 0 0 32px rgba(30,82,210,0.15)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            />
            <div className="group absolute inset-0 overflow-hidden rounded-full bg-[#070e20]">
              <div className="about-parallax absolute -inset-[10%]">
                <Image
                  src="/DSC00106.jpg"
                  alt="Towfiq Bin Hasan"
                  fill
                  sizes="(max-width: 768px) 360px, 400px"
                  className="object-cover object-[50%_20%] brightness-[0.8] transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
              </div>
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-[#050b1a]/70 via-transparent to-transparent"
              />
            </div>
            {/* Floor glow */}
            <span
              aria-hidden
              className="absolute -bottom-6 left-1/2 h-8 w-[85%] -translate-x-1/2 rounded-[100%] bg-sky-400/10 blur-2xl"
            />
          </motion.div>
        </div>

        {/* Copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease }}
            className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-sky-300/80"
          >
            <span className="font-mono text-sky-400">00</span>
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
              className="h-px w-10 origin-left bg-gradient-to-r from-sky-400 to-cyan-400"
            />
            Introduction
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
          >
            About{" "}
            <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
              Me
            </span>
          </motion.h2>

          {/* Text sits behind a gradient rule, left aligned for comfortable reading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="relative mt-7 border-l border-white/10 pl-5 sm:pl-7"
          >
            <span
              aria-hidden
              className="absolute left-0 top-0 h-16 w-px bg-gradient-to-b from-sky-400 to-cyan-400"
            />

            <div ref={copy}>
              <p className="text-sm leading-[1.9] text-white sm:text-[0.95rem] first-letter:float-left first-letter:mr-2.5 first-letter:text-4xl first-letter:font-bold first-letter:leading-none first-letter:text-sky-300 sm:first-letter:text-5xl">
                <Words text={PARAGRAPHS[0]} />
              </p>

              <p className="mt-5 text-sm leading-[1.9] text-white sm:text-[0.95rem]">
                <Words text={PARAGRAPHS[1]} />
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
