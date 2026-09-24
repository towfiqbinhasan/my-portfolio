"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiPlay, FiCalendar, FiFilm } from "react-icons/fi";
import { PageBackdrop, PageHeader, GlowCard, ease } from "@/components/PageShell";
import { Lightbox, lightboxItem } from "@/components/Carousel";

type FilmItem = {
  title: string;
  role: string;
  date: string;
  description: string;
  thumbnail: string;
  videoLink: string;
};

const films: FilmItem[] = [
  {
    title: "TH Team - Saint Martin Travel Short",
    role: "Editor & Cinematographer",
    date: "2025",
    description:
      "A short travel film capturing the journey to Saint Martin's Island, edited with CapCut for the TH Team's social media channels.",
    thumbnail: "/filmography/film1.jpg",
    videoLink: "#",
  },
  {
    title: "Rangamati Travel Vlog",
    role: "Editor & Director",
    date: "2025",
    description:
      "A cinematic travel vlog through the hills of Rangamati, edited with Adobe Premiere Pro for color grading and smooth transitions.",
    thumbnail: "/filmography/film2.jpg",
    videoLink: "#",
  },
];

function showComingSoonToast() {
  alert("This video is not linked online yet.");
}

export default function FilmographyPage() {
  const [selected, setSelected] = useState<FilmItem | null>(null);

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <PageBackdrop />

      <PageHeader
        eyebrow="Films"
        title="My"
        accent="Filmography"
        description="A collection of travel films, vlogs, and creative video work produced and edited with the TH Team."
      />

      {films.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {films.map((film, i) => (
            <GlowCard key={film.title} delay={i * 0.08}>
              <button
                type="button"
                onClick={() => setSelected(film)}
                aria-label={film.title}
                className="btn-press block w-full cursor-pointer text-left"
              >
                <div className="relative h-44 w-full overflow-hidden bg-black/40 sm:h-48">
                  <Image
                    src={film.thumbnail}
                    alt={film.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 400px"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                  {/* Scrim so the play badge and the title below stay readable */}
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-[#020817] via-[#020817]/15 to-transparent"
                  />
                  <span aria-hidden className="carousel-sheen pointer-events-none absolute inset-0" />

                  <span
                    aria-hidden
                    className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    <span className="flex h-14 w-14 scale-90 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 shadow-[0_0_30px_rgba(14, 165, 233,0.5)] ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-100">
                      <FiPlay className="ml-1 text-xl text-white" />
                    </span>
                  </span>
                </div>

                <div className="relative p-5">
                  <h3 className="text-base font-semibold leading-snug text-white">{film.title}</h3>
                  <p className="mt-1.5 text-xs text-sky-300">{film.role}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500 transition-colors duration-500 group-hover:text-gray-400">
                    <FiCalendar className="flex-shrink-0 transition-transform duration-500 group-hover:scale-110" /> {film.date}
                  </p>
                  <span
                    aria-hidden
                    className="mt-3 block h-px w-8 bg-gradient-to-r from-sky-400 to-cyan-400 transition-all duration-500 group-hover:w-16"
                  />
                </div>
              </button>
            </GlowCard>
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-md">
          <GlowCard lift={false} className="px-6 py-12 text-center sm:px-10 sm:py-16">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-40"
              style={{
                background:
                  "radial-gradient(ellipse 60% 70% at 50% 0%, rgba(14, 165, 233,0.18), transparent 70%)",
              }}
            />
            <motion.span
              aria-hidden
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15, ease }}
              className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/25 to-cyan-400/25 text-2xl text-sky-200 ring-1 ring-sky-400/30"
            >
              <FiFilm />
            </motion.span>
            <span
              aria-hidden
              className="relative mx-auto mt-6 block h-px w-16 bg-gradient-to-r from-transparent via-sky-400/60 to-transparent"
            />
          </GlowCard>
        </div>
      )}

      <Lightbox
        open={selected !== null}
        onClose={() => setSelected(null)}
        contentKey={selected?.title}
        wide
      >
        {selected && (
          <>
            <motion.div
              {...lightboxItem(0)}
              className="relative h-56 w-full bg-[#020b1f] xs:h-72 sm:h-80 md:h-96"
            >
              <Image
                src={selected.thumbnail}
                alt={selected.title}
                fill
                sizes="(min-width: 1024px) 896px, 100vw"
                className="object-contain"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a1730] via-[#0a1730]/40 to-transparent"
              />
            </motion.div>

            <div className="relative border-t border-white/5 p-5 sm:p-7 md:p-8">
              <motion.div {...lightboxItem(1)}>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1 text-[11px] uppercase tracking-wider text-sky-200">
                  <FiCalendar className="text-xs" /> {selected.date}
                </span>
                <h3 className="mt-3 bg-gradient-to-r from-white via-sky-200 to-cyan-200 bg-clip-text text-2xl font-semibold leading-snug text-transparent sm:text-3xl">
                  {selected.title}
                </h3>
              </motion.div>

              <motion.div {...lightboxItem(2)} className="mt-4 flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1 text-[11px] text-gray-300 ring-1 ring-white/10 transition hover:bg-sky-500/15 hover:text-white hover:ring-sky-400/40">
                  <FiFilm className="text-sky-300" /> {selected.role}
                </span>
              </motion.div>

              <motion.p
                {...lightboxItem(3)}
                className="mt-6 max-w-2xl text-sm leading-[1.8] text-gray-300 md:text-[0.95rem]"
              >
                {selected.description}
              </motion.p>

              <motion.div {...lightboxItem(4)} className="mt-7 border-t border-white/5 pt-6">
                {selected.videoLink !== "#" ? (
                  <a
                    href={selected.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-press btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-2.5 text-xs font-medium text-white shadow-[0_0_20px_-6px_rgba(14, 165, 233,0.9)] hover:opacity-90 hover:shadow-[0_0_28px_-6px_rgba(34,211,238,0.9)] sm:text-sm"
                  >
                    <FiPlay /> Watch Video
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={showComingSoonToast}
                    className="btn-press inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-xs text-gray-400 hover:border-sky-400/60 hover:bg-sky-500/15 hover:text-white sm:text-sm"
                  >
                    <FiPlay /> Not Linked Yet
                  </button>
                )}
              </motion.div>
            </div>
          </>
        )}
      </Lightbox>
    </section>
  );
}
