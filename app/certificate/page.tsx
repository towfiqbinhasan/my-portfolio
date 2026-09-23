"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { FiX, FiAward, FiCalendar, FiExternalLink, FiZoomIn } from "react-icons/fi";
import certificatesData from "@/data/certificate.json";
import { PageBackdrop, PageHeader, GlowCard, ease } from "@/components/PageShell";
import { ModalGallery, lightboxItem } from "@/components/Carousel";

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

export default function CertificatePage() {
  const [selected, setSelected] = useState<Certificate | null>(null);
  const reduce = useReducedMotion();

  // Lock background scroll while the modal is open
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  // Close modal on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <PageBackdrop />

      <PageHeader
        eyebrow="Credentials"
        title="My"
        accent="Certificates"
        description="A collection of certifications earned through courses, workshops, and professional programs."
      />

      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {certificates.map((cert, i) => (
          <GlowCard key={cert.title + i} delay={(i % 3) * 0.1} className="flex flex-col">
            {/* Image — click to view full size */}
            <button
              type="button"
              onClick={() => setSelected(cert)}
              className="btn-press relative h-52 w-full cursor-zoom-in overflow-hidden bg-black/40"
            >
              <Image
                src={cert.image}
                alt={cert.title}
                fill
                sizes="400px"
                className="object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <span aria-hidden className="carousel-sheen pointer-events-none absolute inset-0" />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/45">
                <span className="flex translate-y-1 items-center gap-2 rounded-full bg-purple-500/80 px-3 py-1.5 text-sm font-medium text-white opacity-0 ring-1 ring-white/15 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <FiZoomIn /> View full size
                </span>
              </div>
            </button>

            <div className="relative flex flex-1 flex-col p-5">
              <h3 className="text-base font-semibold leading-snug text-white">
                {cert.title}
              </h3>

              <a
                href={cert.issuerLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="group/link mt-1 inline-flex w-fit items-center gap-1 text-xs text-purple-300 transition-colors hover:text-purple-200 hover:underline hover:underline-offset-2"
              >
                {cert.issuer}
                <FiExternalLink className="text-[11px] transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
              </a>

              <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
                <FiCalendar className="transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />{" "}
                {cert.date}
              </p>

              <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-gray-400">
                {cert.description}
              </p>

              {Array.isArray(cert.skills) && cert.skills.length > 0 && (
                <div className="mt-auto flex flex-wrap gap-1.5 border-t border-white/10 pt-3">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="btn-press rounded-full bg-purple-500/10 px-2 py-1 text-[11px] leading-none text-purple-300 ring-1 ring-purple-400/20 hover:bg-purple-500/20 hover:text-white hover:ring-purple-400/50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-purple-400 to-transparent transition-transform duration-500 group-hover:scale-x-100"
              />
            </div>
          </GlowCard>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.35, ease }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 px-3 py-6 sm:px-6 sm:py-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16, transition: { duration: 0.22, ease: "easeIn" } }}
              transition={reduce ? { duration: 0.2, ease } : { type: "spring", stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="modal-rim relative my-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e14] shadow-2xl shadow-black/70 sm:rounded-3xl"
            >
              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="btn-press group/close absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-lg text-white/80 ring-1 ring-white/10 backdrop-blur hover:bg-purple-500/60 hover:text-white sm:right-4 sm:top-4 sm:h-10 sm:w-10 sm:text-xl"
              >
                <FiX className="transition-transform duration-300 group-hover/close:rotate-90" />
              </button>

              <div className="modal-scroll max-h-[88vh] overflow-y-auto overscroll-contain sm:max-h-[85vh]">
                {/* Full-size document — never cropped, scales to fit */}
                <ModalGallery images={[selected.image]} alt={selected.title} fit="contain" />

                <div className="relative border-t border-white/5 p-5 sm:p-7 md:p-8">
                  <motion.div {...lightboxItem(0)}>
                    <span
                      aria-label="Certificate"
                      className="btn-press group/badge inline-flex h-7 items-center justify-center rounded-full border border-purple-400/25 bg-purple-500/10 px-3 text-sm text-purple-200 hover:border-purple-400/50 hover:bg-purple-500/20 hover:text-white"
                    >
                      <FiAward className="transition-transform duration-500 group-hover/badge:rotate-12 group-hover/badge:scale-110" />
                    </span>
                    <h3 className="mt-3 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-2xl font-semibold leading-snug text-transparent sm:text-3xl">
                      {selected.title}
                    </h3>
                  </motion.div>

                  <motion.div
                    {...lightboxItem(1)}
                    className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2"
                  >
                    <a
                      href={selected.issuerLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link inline-flex items-center gap-1.5 text-sm text-purple-300 transition-colors hover:text-purple-200 hover:underline hover:underline-offset-2"
                    >
                      {selected.issuer}
                      <FiExternalLink className="text-xs transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                    </a>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-2.5 py-1 text-[11px] text-gray-400 ring-1 ring-white/10">
                      <FiCalendar className="flex-shrink-0" /> {selected.date}
                    </span>
                  </motion.div>

                  <motion.p
                    {...lightboxItem(2)}
                    className="mt-6 max-w-3xl text-sm leading-[1.8] text-gray-300 md:text-[0.95rem]"
                  >
                    {selected.description}
                  </motion.p>

                  {Array.isArray(selected.skills) && selected.skills.length > 0 && (
                    <motion.div
                      {...lightboxItem(3)}
                      className="mt-7 flex flex-wrap gap-2 border-t border-white/5 pt-6"
                    >
                      {selected.skills.map((skill) => (
                        <span
                          key={skill}
                          className="btn-press rounded-full bg-purple-500/10 px-3 py-1.5 text-xs text-purple-200 ring-1 ring-purple-400/25 hover:bg-purple-500/20 hover:text-white hover:ring-purple-400/50"
                        >
                          {skill}
                        </span>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
