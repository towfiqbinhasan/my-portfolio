"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiX, FiPlay, FiCalendar } from "react-icons/fi";

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
    <section className="py-16 px-6 max-w-6xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold mb-4 text-center"
      >
        My <span className="text-purple-400">Filmography</span>
      </motion.h1>
      <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">
        A collection of travel films, vlogs, and creative video work produced and edited with the TH Team.
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {films.map((film, i) => (
          <motion.div
            key={film.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            onClick={() => setSelected(film)}
            className="cursor-pointer bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-400 transition group"
          >
            <div className="relative w-full h-48 overflow-hidden bg-black/40">
              <Image
                src={film.thumbnail}
                alt={film.title}
                fill
                sizes="400px"
                className="object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition">
                <div className="w-14 h-14 rounded-full bg-purple-500/80 flex items-center justify-center">
                  <FiPlay className="text-white text-xl ml-1" />
                </div>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-base font-semibold mb-1 leading-snug">
                {film.title}
              </h3>
              <p className="text-purple-300 text-xs mb-1">{film.role}</p>
              <p className="text-gray-500 text-xs flex items-center gap-1">
                <FiCalendar /> {film.date}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center px-6 py-10 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-[#111117] border border-white/10 rounded-2xl overflow-hidden my-auto"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-purple-500/60 rounded-full text-xl transition"
              >
                <FiX />
              </button>

              <div className="relative w-full h-72 md:h-96 bg-black/40">
                <Image
                  src={selected.thumbnail}
                  alt={selected.title}
                  fill
                  sizes="672px"
                  className="object-cover"
                />
              </div>

              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {selected.title}
                </h3>
                <p className="text-purple-300 text-sm mb-1">{selected.role}</p>
                <p className="text-gray-500 text-xs flex items-center gap-1 mb-4">
                  <FiCalendar /> {selected.date}
                </p>
                <p className="text-gray-300 leading-relaxed text-sm mb-6">
                  {selected.description}
                </p>

                {selected.videoLink !== "#" ? (
                  
               <a     href={selected.videoLink}
                    target="_blank"
                    className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition"
                  >
                    <FiPlay /> Watch Video
                  </a>
                ) : (
                  <span
                    onClick={showComingSoonToast}
                    className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full border border-white/20 text-gray-500 cursor-pointer hover:bg-white/5"
                  >
                    <FiPlay /> Not Linked Yet
                  </span>
                )}
              </div>
            </motion.div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}