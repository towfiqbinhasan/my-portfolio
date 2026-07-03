"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  FiFileText,
  FiExternalLink,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiAward,
  FiGlobe,
  FiImage,
} from "react-icons/fi";

type ConferencePaper = {
  title: string;
  conferenceName: string;
  year: string;
  details: string;
  certificate: string;
  eventImages: string[];
  pdf: string;
  paperLink: string;
  conferenceWebsite: string;
  poster: string;
};

type JournalPaper = {
  title: string;
  journalName: string;
  year: string;
  details: string;
  link: string;
};

const conferencePapers: ConferencePaper[] = [
  {
    title: "A Machine Learning Approach for Quantifying Sea-Level Rise: A Conservative Baseline Forecast through 2030 using Prophet Architecture.",
    conferenceName: "IEEE QPAIN Conference",
    year: "2026",
    details:
      "This research develops a 'Conservative Baseline' forecast for sea-level rise using 32 years (1993-2025) of NASA satellite altimetry data and Facebook's Prophet machine learning architecture to model long-term trends beyond seasonal noise. The model predicts a 9.59mm sea-level rise by 2030, at a conservative rate of ~1.9mm/year — notably lower than the IPCC AR6 accelerated scenarios (3.5-4.5mm/year) — offering a practical 'safe lower bound' for coastal infrastructure planning. Applied to Bangladesh, the study identifies Satkhira as extreme risk due to low elevation and saltwater intrusion, with Khulna and Bagerhat facing high flood risk and threats to the Sundarbans mangrove forest. The findings recommend engineers use the 1.9mm/year rate as a minimum standard when designing or reinforcing coastal polders.",
    certificate: "/research/cert1.jpg",
    eventImages: ["/research/event1-1.jpg", "/research/event1-2.jpg","/research/event1-3.jpg","/research/event1-4.jpg","/research/event1-5.jpg","/research/event1-6.jpg","/research/event1-7.jpg","/research/event1-8.jpg","/research/event1-9.jpg","/research/event1-10.jpg","/research/event1-11.jpg"],
    pdf: "/research/paper1.pdf",
    paperLink: "https://ieeexplore.ieee.org/document/11546265",
    conferenceWebsite: "https://qpain.org/",
    poster: "/research/poster1.jpg",
  },
];

const journalPapers: JournalPaper[] = [
  {
    title: "Your Journal Paper Title Here",
    journalName: "Journal Name",
    year: "2025",
    details: "এই পেপারের সংক্ষিপ্ত বিবরণ লিখো।",
    link: "#",
  },
];
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      className="cursor-pointer bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-400 transition group"
    >
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={paper.certificate}
          alt={paper.title}
          fill
          sizes="400px"
          className="object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
        <span className="absolute top-3 left-3 flex items-center gap-1 text-xs bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-purple-300">
          <FiAward /> Certificate
        </span>
      </div>

      <div className="p-6">
        <p className="text-purple-300 text-xs mb-2">
          {paper.conferenceName}, {paper.year}
        </p>
        <h3 className="text-lg font-semibold mb-3 leading-snug">{paper.title}</h3>
        <p className="text-gray-400 text-sm line-clamp-2">{paper.details}</p>
      </div>
    </motion.div>
  );
}

function ConferenceModal({
  paper,
  onClose,
}: {
  paper: ConferencePaper;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % paper.eventImages.length);
  const prev = () =>
    setCurrent((c) => (c - 1 + paper.eventImages.length) % paper.eventImages.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center px-6 py-10 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-2xl w-full bg-[#111117] border border-white/10 rounded-2xl overflow-hidden my-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-purple-500/60 rounded-full text-xl transition"
        >
          <FiX />
        </button>

        {/* Static Certificate */}
        <div className="relative w-full h-64 md:h-80 bg-black/40">
          <Image
            src={paper.certificate}
            alt="Certificate"
            fill
            sizes="672px"
            className="object-contain bg-black/60"
          />
          <span className="absolute top-3 left-3 flex items-center gap-1 text-xs bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-purple-300">
            <FiAward /> Certificate
          </span>
        </div>

        {/* Event Slideshow */}
{paper.eventImages.length > 0 && (
  <div className="relative w-full h-72 md:h-96 bg-black/60 border-t border-white/10">
    <AnimatePresence mode="wait">
      <motion.div
        key={current}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0"
      >
        <Image
          src={paper.eventImages[current]}
          alt="Event"
          fill
          sizes="672px"
          className="object-contain"
        />
      </motion.div>
    </AnimatePresence>

            {paper.eventImages.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-black/50 hover:bg-purple-500/60 rounded-full transition"
                >
                  <FiChevronLeft />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-black/50 hover:bg-purple-500/60 rounded-full transition"
                >
                  <FiChevronRight />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {paper.eventImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={
                        i === current
                          ? "w-5 h-2 rounded-full transition bg-purple-400"
                          : "w-2 h-2 rounded-full transition bg-white/40"
                      }
                    />
                  ))}
                </div>
              </>
            )}
            <span className="absolute top-3 left-3 flex items-center gap-1 text-xs bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-purple-300">
              Event Photos
            </span>
          </div>
        )}

        <div className="p-6 md:p-8">
          <p className="text-purple-300 text-xs mb-2">
            {paper.conferenceName}, {paper.year}
          </p>
          <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {paper.title}
          </h3>
          <p className="text-gray-300 leading-relaxed text-sm md:text-base mb-6">
            {paper.details}
          </p>

        <div className="flex gap-4 flex-wrap">
  {paper.pdf !== "#" ? (
    
   <a   href={paper.pdf}
      target="_blank"
      className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition"
    >
      <FiFileText /> View Paper
    </a>
  ) : (
    <span
      onClick={showNoPdfToast}
      className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full border border-white/20 text-gray-500 cursor-pointer hover:bg-white/5"
    >
      <FiFileText /> View Paper
    </span>
  )}

  {paper.paperLink !== "#" ? (
    
    <a  href={paper.paperLink}
      target="_blank"
      className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/10 transition"
    >
      <FiExternalLink /> View Paper Online
    </a>
  ) : (
    <span
      onClick={showNotPublishedToast}
      className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full border border-white/20 text-gray-500 cursor-pointer hover:bg-white/5"
    >
      <FiExternalLink /> View Paper Online
    </span>
  )}

  
   <a href={paper.conferenceWebsite}
    target="_blank"
    className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/10 transition"
  >
    <FiGlobe /> Conference Website
  </a>

   <a href={paper.poster}
    target="_blank"
    className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/10 transition"
  >
    <FiImage /> View Poster
  </a>
</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Research() {
  const [selected, setSelected] = useState<ConferencePaper | null>(null);

  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold mb-4 text-center"
      >
        Research <span className="text-purple-400">Papers</span>
      </motion.h1>
      <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
       I have a diverse research background covering Machine Learning, Environmental Science, and Public Health. My completed works include a comparative study of data mining techniques for heart disease classification, an analysis of soil salinity in the Sundarbans to track climate change impacts, and a study on hospital admission trends at Kurmitola General Hospital to improve resource management. Building on this foundation, I am currently very active in my university research life. I am working on several new conference papers and a comprehensive journal publication, focusing on more advanced data science topics and larger datasets. My goal is to continue expanding my research portfolio through ongoing university projects and contribute meaningful findings to the global academic community. 
      </p>

      {/* Conference Papers */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <span className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
          Conference <span className="text-purple-400">Papers</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {conferencePapers.map((p, i) => (
            <ConferenceCard
              key={p.title}
              paper={p}
              index={i}
              onClick={() => setSelected(p)}
            />
          ))}
        </div>
      </div>

      {/* Journal Papers */}
      <div>
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <span className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
          Journal <span className="text-purple-400">Papers</span>
        </h2>
        <div className="space-y-6">
          {journalPapers.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-400 transition"
            >
              <div className="flex items-start gap-3">
                <FiFileText className="text-purple-400 text-2xl mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-purple-300 text-xs mb-1">
                    {p.journalName}, {p.year}
                  </p>
                  <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{p.details}</p>
                  
                  <a  href={p.link}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-sm hover:text-purple-400"
                  >
                    <FiExternalLink /> View Paper
                  </a>
                </div>
              </div>
            </motion.div>
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