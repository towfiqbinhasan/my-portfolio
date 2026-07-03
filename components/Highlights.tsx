"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiX } from "react-icons/fi";

const highlights = [
  {
    src: "/highlights/highlight1.jpeg", 
    caption: "Thrilled to have presented my research at the 2026 IEEE 2nd International Conference on Quantum Photonics, Artificial Intelligence and Networking (QPAIN 2026)!",
    details:
      "I am pleased to share that I successfully participated in the 2026 IEEE 2nd International Conference on Quantum Photonics, Artificial Intelligence and Networking (QPAIN 2026), organized by the IEEE Photonics Society Bangladesh Chapter. It was an enriching experience to engage with scholars, and the paper was presented at the IT Business Incubator, Chittagong University of Engineering and Technology (CUET), Chattogram, Bangladesh.",
  },
  {
    src: "/highlights/highlight2.jpeg",
    caption: "Thrilled to have presented my research at the 24th International Mathematics Conference!",
    details:
      "I am pleased to share that I successfully participated in the 24th International Mathematics Conference, organized by the Department of Mathematics, University of Chittagong. It was an enriching experience to engage with scholars and present my work on",
  },
  {
    src: "/highlights/highlight3.jpeg",
    caption: "Research Poster Presentation at National BioMed Health ResearchCon (NBHRC) 2025",
    details:
      "Successfully presented a research poster titled 'Monthly Trends in Hospital Admissions and Mortality: A Disease-Wise Analysis at Kurmitola General Hospital' at the National BioMed Health ResearchCon 2025. The study focused on analyzing healthcare data and disease patterns to improve hospital management and patient outcomes. The event was held at Dhaka Medical College, providing a platform to engage with the medical research community.",
  },
  {
    src: "/highlights/highlight4.jpeg",
    caption: "Proud to have been a part of the International Bioscience Conference and Carnival 2025!",
    details:
      "Successfully completed another milestone at the International Bioscience Conference (ICBC) 2025, held at Rangamati Science and Technology University. It was an incredible experience engaging with global experts and discussing innovations in biosafety and biotechnology. Onwards and upwards!",
  },
];

const loopItems = [...highlights, ...highlights];

type HighlightItem = {
  src: string;
  caption: string;
  details: string;
};

export default function Highlights() {
  const [selected, setSelected] = useState<HighlightItem | null>(null);

  return (
    <section className="py-20 px-6 overflow-hidden">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold mb-12 text-center"
      >
        Highlighter <span className="text-purple-400">Points</span>
      </motion.h2>

      <div className="relative w-full">
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          {loopItems.map((item, i) => (
            <button
              key={i}
              onClick={() => setSelected(item)}
              className="min-w-[280px] md:min-w-[340px] bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-400 transition text-left cursor-pointer"
            >
              <div className="relative w-full h-64">
                <Image
                  src={item.src}
                  alt={item.caption}
                  fill
                  sizes="340px"
                  className="object-cover"
                />
              </div>
              <p className="text-center text-sm text-gray-300 py-4 px-3">
                {item.caption}
              </p>
            </button>
          ))}
        </motion.div>
      </div>

      {/* Lightbox Modal */}
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
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-[#111117] border border-white/10 rounded-2xl overflow-hidden my-auto"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-purple-500/60 rounded-full text-xl transition"
              >
                <FiX />
              </button>

              <div className="relative w-full h-72 md:h-96">
                <Image
                  src={selected.src}
                  alt={selected.caption}
                  fill
                  sizes="672px"
                  className="object-cover"
                />
              </div>

              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {selected.caption}
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                  {selected.details}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}