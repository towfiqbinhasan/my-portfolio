"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export default function About() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-24">
      {/* Soft spotlight behind the block */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 30% 40%, rgba(168,85,247,0.10), transparent 70%)",
        }}
      />

      <div className="grid items-center gap-10 md:grid-cols-[minmax(0,320px)_1fr] md:gap-14">
        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="relative mx-auto w-full max-w-[260px] sm:max-w-[300px] md:max-w-none"
        >
          {/* Glow + offset frame */}
          <span
            aria-hidden
            className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-purple-500/25 via-violet-500/10 to-cyan-400/25 blur-2xl"
          />
          <span
            aria-hidden
            className="absolute -bottom-3 -right-3 h-full w-full rounded-3xl border border-purple-400/25"
          />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="group relative aspect-[4/5] overflow-hidden rounded-3xl ring-1 ring-white/10"
          >
            <Image
              src="/DSC00106.jpg"
              alt="Towfiq Bin Hasan"
              fill
              sizes="(max-width: 768px) 300px, 320px"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent"
            />
            <span aria-hidden className="carousel-sheen pointer-events-none absolute inset-0" />
          </motion.div>
        </motion.div>

        {/* Copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease }}
            className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-purple-300/80"
          >
            <span className="font-mono text-purple-400">00</span>
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
              className="h-px w-10 origin-left bg-gradient-to-r from-purple-400 to-cyan-400"
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
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
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
              className="absolute left-0 top-0 h-16 w-px bg-gradient-to-b from-purple-400 to-cyan-400"
            />

            <p className="text-sm leading-[1.9] text-gray-400 sm:text-[0.95rem] first-letter:float-left first-letter:mr-2.5 first-letter:text-4xl first-letter:font-bold first-letter:leading-none first-letter:text-purple-300 sm:first-letter:text-5xl">
              I am a meticulous computer science and engineering student at AIUB, majoring in data science. I have a strong passion for my field, particularly in machine learning, data mining, and research. My technical expertise includes C++, Java, C#, and full-stack web development, along with a solid understanding of DSA and database management. I have also participated in several academic conferences and have shared my projects on GitHub.
            </p>

            <p className="mt-5 text-sm leading-[1.9] text-gray-400 sm:text-[0.95rem]">
              Beyond my technical life, I am an adventurous traveler. I have a dream of going on a world tour, and I have already successfully traveled across all of Bangladesh with my travel group, TH Team. My experience as a traveler has made me a more adaptable and fast learner. With a mix of strong analytical skills, teaching experience, and a motivated mindset, I am eager to bring my technical knowledge into a professional environment.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
