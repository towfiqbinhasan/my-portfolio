"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiAward, FiCalendar, FiExternalLink, FiMaximize2 } from "react-icons/fi";
import certificatesData from "@/data/certificate.json";
import { ViewDetails, SectionHeading } from "@/components/HomePreviews";
import { Carousel, Lightbox, lightboxItem } from "@/components/Carousel";

type Certificate = {
  title: string;
  issuer: string;
  issuerLink: string;
  date: string;
  image: string;
  skills: string[];
  description: string;
};

const certificates: Certificate[] = certificatesData as Certificate[];

export default function CertificatesSlider() {
  const [index, setIndex] = useState<number | null>(null);
  const selected = index === null ? null : certificates[index];
  const step = (delta: number) =>
    setIndex((i) => (i === null ? i : (i + delta + certificates.length) % certificates.length));

  return (
    <section className="relative overflow-hidden py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="07"
          eyebrow="Credentials"
          title="My"
          accent="Certificates"
          text={`${certificates.length} certificates from courses, conferences and internships. Click any card to read the details.`}
          href="/certificate"
          label={`View all ${certificates.length}`}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <Carousel
          count={certificates.length}
          renderCard={(i, key) => {
            const cert = certificates[i];
            return (
              <button
                key={key}
                onClick={() => setIndex(i)}
                draggable={false}
                className="carousel-card group relative w-[220px] flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-left xs:w-[250px] sm:w-[290px]"
              >
                {/* Certificate sheet, framed so the white paper sits on dark glass */}
                <div className="relative m-3 overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02] p-px">
                  <div className="relative h-36 w-full overflow-hidden rounded-xl bg-[#04102a] sm:h-40">
                    <Image
                      src={cert.image}
                      alt={cert.title}
                      fill
                      sizes="290px"
                      className="object-contain p-1.5 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      draggable={false}
                    />
                    <span
                      aria-hidden
                      className="carousel-sheen pointer-events-none absolute inset-0"
                    />
                    <span className="pointer-events-none absolute right-2 top-2 flex h-7 w-7 translate-y-1 items-center justify-center rounded-full bg-black/70 text-xs text-white opacity-0 ring-1 ring-white/15 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <FiMaximize2 />
                    </span>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-1">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white">{cert.title}</h3>
                  <p className="mt-1.5 truncate text-xs text-sky-300/90">{cert.issuer}</p>
                  {cert.date && (
                    <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-gray-500">
                      <FiCalendar /> {cert.date}
                    </p>
                  )}
                </div>

                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-sky-400 to-transparent transition-transform duration-500 group-hover:scale-x-100"
                />
              </button>
            );
          }}
        />
      </motion.div>

      <div className="mt-12 flex justify-center md:hidden">
        <ViewDetails href="/certificate" label={`View all ${certificates.length} certificates`} />
      </div>

      <Lightbox
        open={selected !== null}
        onClose={() => setIndex(null)}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
        position={index === null ? undefined : `${index + 1} / ${certificates.length}`}
        contentKey={index ?? undefined}
        wide
      >
        {selected && (
          <>
            <motion.div
              {...lightboxItem(0)}
              className="relative h-60 w-full bg-[#020b1f] xs:h-72 sm:h-80 md:h-[26rem]"
            >
              <Image
                src={selected.image}
                alt={selected.title}
                fill
                sizes="(min-width: 1024px) 896px, 100vw"
                className="object-contain p-4 sm:p-6"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a1730] to-transparent"
              />
            </motion.div>

            <div className="relative border-t border-white/5 p-5 sm:p-7 md:p-8">
              <motion.div {...lightboxItem(1)} className="flex items-start gap-3 sm:gap-4">
                <span className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/25 to-cyan-400/25 text-sky-200 ring-1 ring-sky-400/30">
                  <FiAward />
                </span>
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1 text-[11px] uppercase tracking-wider text-sky-200">
                    <FiCalendar className="text-xs" /> {selected.date}
                  </span>
                  <h3 className="mt-2.5 bg-gradient-to-r from-white via-sky-200 to-cyan-200 bg-clip-text text-xl font-semibold leading-snug text-transparent sm:text-2xl">
                    {selected.title}
                  </h3>
                </div>
              </motion.div>

              <motion.div {...lightboxItem(2)} className="mt-4 flex flex-wrap gap-1.5">
                {Array.isArray(selected.skills) &&
                  selected.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-white/5 px-2.5 py-1 text-[11px] text-gray-300 ring-1 ring-white/10 transition hover:bg-sky-500/15 hover:text-white hover:ring-sky-400/40"
                    >
                      {skill}
                    </span>
                  ))}
              </motion.div>

              <motion.p
                {...lightboxItem(3)}
                className="mt-6 max-w-3xl text-sm leading-[1.8] text-gray-300 md:text-[0.95rem]"
              >
                {selected.description}
              </motion.p>

              <motion.div {...lightboxItem(4)} className="mt-7 border-t border-white/5 pt-6">
                <a
                  href={selected.issuerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 text-xs text-gray-200 transition hover:border-sky-400/60 hover:bg-sky-500/15 hover:text-white sm:px-5 sm:text-sm"
                >
                  {selected.issuer} <FiExternalLink className="text-xs" />
                </a>
              </motion.div>
            </div>
          </>
        )}
      </Lightbox>
    </section>
  );
}
