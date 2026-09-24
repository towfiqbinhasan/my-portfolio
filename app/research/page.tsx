"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  FiFileText,
  FiExternalLink,
  FiX,
  FiAward,
  FiGlobe,
  FiImage,
  FiEye,
} from "react-icons/fi";
import conferenceData from "@/data/conference.json";
import journalData from "@/data/journal.json";
import { PageBackdrop, PageHeader, GlowCard, StatTile, ease } from "@/components/PageShell";
import { ModalGallery, lightboxItem } from "@/components/Carousel";

type ConferencePaper = {
  title: string;
  conferenceName: string;
  year: string;
  details: string;
  certificateImage: string;
  eventImage: string | string[];
  paperPdf: string;
  paperLink: string;
  conferenceWebsite: string;
  posterImage: string;
};

type JournalPaper = {
  title: string;
  journalName: string;
  year: string;
  details: string;
  link: string;
};

const conferencePapers: ConferencePaper[] = conferenceData as ConferencePaper[];
const journalPapers: JournalPaper[] = journalData as JournalPaper[];

// Normalize eventImage to always be an array (mobile app may send a single string)
function getEventImages(paper: ConferencePaper): string[] {
  if (!paper.eventImage) return [];
  return Array.isArray(paper.eventImage) ? paper.eventImage : [paper.eventImage];
}

function showNotPublishedToast() {
  toast("This paper has not been published online yet.", {
    icon: "📄",
  });
}

function showNoPdfToast() {
  toast("This paper's conference presentation happened, but it hasn't been published online yet.", {
    icon: "📄",
  });
}

/** Small section title with the gradient bar, matching the home page. */
function SectionTitle({ title, accent }: { title: string; accent: string }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease }}
      className="mb-6 flex items-center gap-3 text-xl font-bold tracking-tight sm:mb-8 sm:text-2xl"
    >
      <span className="h-7 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-b from-sky-500 to-cyan-400 shadow-[0_0_14px_-2px_rgba(14, 165, 233,0.8)] sm:h-8 sm:w-2" />
      {title}{" "}
      <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
        {accent}
      </span>
    </motion.h2>
  );
}

function ConferenceCard({
  paper,
  index,
  onClick,
}: {
  paper: ConferencePaper;
  index: number;
  onClick: () => void;
}) {
  return (
    <GlowCard delay={(index % 2) * 0.12} className="flex flex-col">
      <div onClick={onClick} className="flex flex-1 cursor-pointer flex-col">
        {/* Certificate preview — full image visible, no cropping */}
        <div className="relative h-48 w-full overflow-hidden bg-black/40 sm:h-52">
          <Image
            src={paper.certificateImage}
            alt={paper.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020817] via-[#020817]/15 to-transparent"
          />
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] text-sky-200 ring-1 ring-white/10 backdrop-blur">
            <FiAward className="transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />{" "}
            Certificate
          </span>
          <span aria-hidden className="carousel-sheen pointer-events-none absolute inset-0" />
        </div>

        <div className="relative flex flex-1 flex-col p-5 sm:p-6">
          <p className="text-[11px] leading-relaxed text-sky-300 sm:text-xs">
            {paper.conferenceName}, {paper.year}
          </p>
          <h3 className="mt-2 text-base font-semibold leading-snug text-white sm:text-lg">
            {paper.title}
          </h3>
          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-gray-400 sm:text-sm">
            {paper.details}
          </p>

          {/* View Details button */}
          <div className="mt-auto pt-5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="btn-press btn-shine group/cta inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2.5 text-xs font-medium text-white shadow-[0_0_20px_-6px_rgba(14, 165, 233,0.9)] hover:opacity-90 sm:px-5 sm:text-sm"
            >
              <FiEye className="transition-transform duration-300 group-hover/cta:scale-110" />{" "}
              View Details
            </button>
          </div>
        </div>
      </div>
    </GlowCard>
  );
}

function ConferenceModal({
  paper,
  onClose,
}: {
  paper: ConferencePaper;
  onClose: () => void;
}) {
  const eventImages = getEventImages(paper);

  // Escape to close, page scroll locked (the gallery handles its own arrow keys).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      transition={{ duration: 0.35, ease }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 px-3 py-6 sm:px-6 sm:py-10"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16, transition: { duration: 0.22, ease: "easeIn" } }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="modal-rim relative my-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#0a1730] shadow-2xl shadow-black/70 sm:rounded-3xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="btn-press group/close absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-lg text-white/80 ring-1 ring-white/10 backdrop-blur hover:bg-sky-500/60 hover:text-white sm:right-4 sm:top-4 sm:h-10 sm:w-10 sm:text-xl"
        >
          <FiX className="transition-transform duration-300 group-hover/close:rotate-90" />
        </button>

        <div className="modal-scroll max-h-[88vh] overflow-y-auto overscroll-contain sm:max-h-[85vh]">
          {/* Certificate */}
          <div className="relative">
            <ModalGallery
              images={[paper.certificateImage]}
              alt={`${paper.title} certificate`}
              fit="contain"
            />
            <span className="pointer-events-none absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] text-sky-200 ring-1 ring-white/10 backdrop-blur sm:text-xs">
              <FiAward /> Certificate
            </span>
          </div>

          {/* Event photos */}
          {eventImages.length > 0 && (
            <div className="relative border-t border-white/10">
              <ModalGallery
                images={eventImages}
                alt={`${paper.title} event photo`}
                fit="cover"
              />
              <span className="pointer-events-none absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] text-sky-200 ring-1 ring-white/10 backdrop-blur sm:text-xs">
                Event Photos
              </span>
            </div>
          )}

          <div className="relative border-t border-white/5 p-5 sm:p-7 md:p-8">
            <motion.div {...lightboxItem(0)}>
              <span className="btn-press inline-flex items-center gap-1.5 rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1 text-[11px] tracking-wider text-sky-200 hover:border-sky-400/50 hover:bg-sky-500/20 hover:text-white">
                {paper.conferenceName}, {paper.year}
              </span>
              <h3 className="mt-3 bg-gradient-to-r from-white via-sky-200 to-cyan-200 bg-clip-text text-2xl font-semibold leading-snug text-transparent sm:text-3xl">
                {paper.title}
              </h3>
            </motion.div>

            <motion.p
              {...lightboxItem(1)}
              className="mt-6 max-w-3xl text-sm leading-[1.8] text-gray-300 md:text-[0.95rem]"
            >
              {paper.details}
            </motion.p>

            <motion.div
              {...lightboxItem(2)}
              className="mt-7 flex flex-wrap gap-2.5 border-t border-white/5 pt-6 sm:gap-3"
            >
              {paper.paperPdf && paper.paperPdf !== "#" ? (
                <a
                  href={paper.paperPdf}
                  target="_blank"
                  className="btn-press btn-shine group/cta inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2.5 text-xs font-medium text-white shadow-[0_0_20px_-6px_rgba(14, 165, 233,0.9)] hover:opacity-90 sm:px-5 sm:text-sm"
                >
                  <FiFileText className="transition-transform duration-300 group-hover/cta:scale-110" />{" "}
                  View Paper
                </a>
              ) : (
                <span
                  onClick={showNoPdfToast}
                  className="btn-press inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 text-xs text-gray-500 hover:bg-white/5 hover:text-gray-300 sm:px-5 sm:text-sm"
                >
                  <FiFileText /> View Paper
                </span>
              )}

              {paper.paperLink && paper.paperLink !== "#" ? (
                <a
                  href={paper.paperLink}
                  target="_blank"
                  className="btn-press group/link inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 text-xs hover:border-sky-400/60 hover:bg-sky-500/15 hover:text-white sm:px-5 sm:text-sm"
                >
                  <FiExternalLink className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />{" "}
                  View Paper Online
                </a>
              ) : (
                <span
                  onClick={showNotPublishedToast}
                  className="btn-press inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 text-xs text-gray-500 hover:bg-white/5 hover:text-gray-300 sm:px-5 sm:text-sm"
                >
                  <FiExternalLink /> View Paper Online
                </span>
              )}

              {paper.conferenceWebsite && (
                <a
                  href={paper.conferenceWebsite}
                  target="_blank"
                  className="btn-press group/link inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 text-xs hover:border-sky-400/60 hover:bg-sky-500/15 hover:text-white sm:px-5 sm:text-sm"
                >
                  <FiGlobe className="transition-transform duration-500 group-hover/link:rotate-[20deg] group-hover/link:scale-110" />{" "}
                  Conference Website
                </a>
              )}

              {paper.posterImage && (
                <a
                  href={paper.posterImage}
                  target="_blank"
                  className="btn-press group/link inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 text-xs hover:border-sky-400/60 hover:bg-sky-500/15 hover:text-white sm:px-5 sm:text-sm"
                >
                  <FiImage className="transition-transform duration-300 group-hover/link:scale-110" />{" "}
                  View Poster
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Research() {
  const [selected, setSelected] = useState<ConferencePaper | null>(null);

  const ieeeCount = conferencePapers.filter((p) => /ieee/i.test(p.conferenceName)).length;

  return (
    <section className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <PageBackdrop />

      <PageHeader
        eyebrow="Academia"
        title="Research"
        accent="Papers"
        description={
          <p>
            I have a diverse research background covering Machine Learning, Environmental Science, and Public Health. My completed works include a comparative study of data mining techniques for heart disease classification, an analysis of soil salinity in the Sundarbans to track climate change impacts, and a study on hospital admission trends at Kurmitola General Hospital to improve resource management. Building on this foundation, I am currently very active in my university research life. I am working on several new conference papers and a comprehensive journal publication, focusing on more advanced data science topics and larger datasets. My goal is to continue expanding my research portfolio through ongoing university projects and contribute meaningful findings to the global academic community.
          </p>
        }
      >
        <div className="mx-auto grid max-w-xl grid-cols-3 gap-3 sm:gap-4">
          <StatTile value={conferencePapers.length} label="Conference papers" />
          <StatTile value={ieeeCount} label="IEEE conferences" delay={0.1} />
          <StatTile value={journalPapers.length} label="Journal (in progress)" delay={0.2} />
        </div>
      </PageHeader>

      {/* Conference Papers */}
      <div className="mb-16 sm:mb-20">
        <SectionTitle title="Conference" accent="Papers" />
        <div className="grid gap-5 md:grid-cols-2">
          {conferencePapers.map((p, i) => (
            <ConferenceCard
              key={p.title + i}
              paper={p}
              index={i}
              onClick={() => setSelected(p)}
            />
          ))}
        </div>
      </div>

      {/* Journal Papers */}
      <div>
        <SectionTitle title="Journal" accent="Papers" />
        <div className="space-y-4 sm:space-y-5">
          {journalPapers.map((p, i) => (
            <GlowCard key={p.title + i} delay={i * 0.1} className="p-5 sm:p-6">
              <div className="relative flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-cyan-400/20 text-sky-200 ring-1 ring-sky-400/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <FiFileText />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-sky-300 sm:text-xs">
                    {p.journalName}, {p.year}
                  </p>
                  <h3 className="mt-1.5 text-base font-semibold leading-snug text-white sm:text-lg">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-gray-400 sm:text-sm">
                    {p.details}
                  </p>

                  <a
                    href={p.link}
                    target="_blank"
                    className="btn-press group/link mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs hover:border-sky-400/60 hover:bg-sky-500/15 hover:text-white sm:text-sm"
                  >
                    <FiExternalLink className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />{" "}
                    View Paper
                  </a>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <ConferenceModal paper={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
