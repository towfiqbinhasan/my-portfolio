"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiExternalLink, FiCalendar, FiMapPin } from "react-icons/fi";
import { qualifications } from "@/lib/qualifications";
import { PageBackdrop, PageHeader, GlowCard, ease } from "@/components/PageShell";

export default function Qualification() {
  return (
    <section className="relative px-4 sm:px-6 py-12 sm:py-16 max-w-5xl mx-auto">
      <PageBackdrop />

      <PageHeader
        eyebrow="Education"
        title="My"
        accent="Qualification"
        description={
          <>
            <p>
              I am currently pursuing my Bachelor of Science in Computer Science and Engineering (CSE) at the American International University-Bangladesh (AIUB), where I am developing my technical skills and passion for technology. My academic journey toward engineering began at Pirgonj Government College, Thakurgaon, where I completed my Higher Secondary Certificate (HSC).
            </p>
            <p className="mt-4">
              Before college, I spent my foundational years at Collectorate Public School and College, Thakurgaon, where I completed my Junior School Certificate (JSC) and Secondary School Certificate (SSC), studying there from Class 8 through Class 10. Earlier in my secondary education, I attended Eco Pathshala in Thakurgaon for Classes 6 and 7.
            </p>
            <p className="mt-4">
              My primary education was completed at Boro Polashbari Government Primary School in Baliadangi, where I attended classes 3 through 5 and sat for my Primary School Certificate (PSC) examination. My very first steps into schooling began at People&apos;s Kindergarten School in Baliadangi, where I studied from nursery up to Class 2. This diverse academic path across various institutions has shaped my dedication and adaptability as a student.
            </p>
          </>
        }
      />

      <div className="relative">
        {/* Timeline spine, drawn as the section comes into view */}
        <motion.div
          aria-hidden
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.4, ease }}
          className="absolute left-4 top-0 bottom-0 w-px origin-top bg-gradient-to-b from-sky-500 via-cyan-400 to-transparent sm:left-6 md:left-1/2 md:-translate-x-1/2"
        />

        <div className="space-y-8 sm:space-y-12">
          {qualifications.map((q, i) => (
            <div
              key={q.degree}
              className={
                i % 2 === 1
                  ? "relative flex flex-col md:flex-row-reverse items-start gap-4 sm:gap-6"
                  : "relative flex flex-col md:flex-row items-start gap-4 sm:gap-6"
              }
            >
              {/* Node on the spine */}
              <motion.span
                aria-hidden
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease }}
                className="absolute left-4 top-7 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.8)] ring-4 ring-[#020817] sm:left-6 sm:top-8 md:left-1/2"
              />

              <div className="ml-10 w-[calc(100%-2.5rem)] sm:ml-16 sm:w-[calc(100%-4rem)] md:ml-0 md:w-1/2">
                <GlowCard delay={i * 0.12} className={i % 2 === 1 ? "md:ml-10" : "md:mr-10"}>
                  <div className="relative h-40 w-full overflow-hidden sm:h-44 md:h-48">
                    <Image
                      src={q.image}
                      alt={q.institute}
                      fill
                      sizes="(max-width: 768px) 100vw, 500px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-[#020817]/20 to-transparent" />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] text-sky-200 ring-1 ring-white/10 backdrop-blur">
                      <FiCalendar className="transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />{" "}
                      {q.duration}
                    </span>
                    <span
                      aria-hidden
                      className="carousel-sheen pointer-events-none absolute inset-0"
                    />
                  </div>

                  <div className="relative p-5 sm:p-6">
                    <h3 className="text-base font-semibold leading-snug text-white sm:text-lg">
                      {q.degree}
                    </h3>
                    <p className="mt-1.5 text-xs text-sky-300 sm:text-sm">{q.major}</p>
                    <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-gray-400 sm:text-sm">
                      <FiMapPin className="mt-0.5 flex-shrink-0 text-sky-400/70 transition-all duration-300 group-hover:scale-110 group-hover:text-sky-300" />
                      {q.institute}
                    </p>

                    {q.website !== "#" ? (
                      <a
                        href={q.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-press group/link mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs hover:border-sky-400/60 hover:bg-sky-500/15 hover:text-white sm:text-sm"
                      >
                        Visit Website
                        <FiExternalLink className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                      </a>
                    ) : null}
                  </div>
                </GlowCard>
              </div>

              <div className="hidden md:block md:w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
