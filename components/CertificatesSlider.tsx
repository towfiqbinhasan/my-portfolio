"use client";
import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useAnimationFrame,
} from "framer-motion";
import Image from "next/image";
import { FiX, FiAward, FiCalendar, FiExternalLink } from "react-icons/fi";
import certificatesData from "@/data/certificate.json";

type Certificate = {
  title: string;
  issuer: string;
  issuerLink: string;
  date: string;
  image: string;
  skills: string[];
  description: string;
};

const certificates: Certificate[] = certificatesData;

const loopItems = [...certificates, ...certificates, ...certificates];

const CARD_WIDTH = 280;
const GAP = 24;
const ITEM_SPAN = CARD_WIDTH + GAP;
const LOOP_WIDTH = ITEM_SPAN * certificates.length;

function wrapPosition(value: number) {
  let v = value % LOOP_WIDTH;
  if (v > 0) v -= LOOP_WIDTH;
  return v;
}

export default function CertificatesSlider() {
  const [selected, setSelected] = useState<Certificate | null>(null);
  const isInteracting = useRef(false);
  const x = useMotionValue(0);

  useAnimationFrame((_, delta) => {
    if (isInteracting.current) return;
    const next = wrapPosition(x.get() - (delta / 1000) * 40);
    x.set(next);
  });

  return (
    <section className="py-10 px-6 overflow-hidden">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold mb-12 text-center"
      >
        My <span className="text-purple-400">Certificates</span>
      </motion.h2>

      <div className="relative w-full">
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-6 cursor-grab active:cursor-grabbing"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -Infinity, right: Infinity }}
          dragElastic={0.05}
          onPointerDown={() => {
            isInteracting.current = true;
          }}
          onDrag={() => {
            x.set(wrapPosition(x.get()));
          }}
          onDragEnd={() => {
            x.set(wrapPosition(x.get()));
            isInteracting.current = false;
          }}
          onPointerUp={() => {
            isInteracting.current = false;
          }}
        >
          {loopItems.map((cert, i) => (
            <button
              key={i}
              onClick={() => setSelected(cert)}
              className="min-w-[220px] md:min-w-[280px] bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-400 transition text-left select-none"
              draggable={false}
            >
              <div className="relative w-full h-40 bg-black/40 pointer-events-none">
                <Image
                  src={cert.image}
                  alt={cert.title}
                  fill
                  sizes="280px"
                  className="object-contain"
                  draggable={false}
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold mb-1 leading-snug line-clamp-2">
                  {cert.title}
                </h3>
                <p className="text-purple-300 text-xs">{cert.issuer}</p>
              </div>
            </button>
          ))}
        </motion.div>
      </div>

      {/* Certificate Detail Modal */}
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
                className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-purple-500/60 rounded-full text-xl transition"
              >
                <FiX />
              </button>

              <div className="relative w-full h-72 md:h-96 bg-black/60">
                <Image
                  src={selected.image}
                  alt={selected.title}
                  fill
                  sizes="672px"
                  className="object-contain"
                />
              </div>

              <div className="p-6 md:p-8">
                <div className="flex items-start gap-3 mb-4">
                  <FiAward className="text-purple-400 text-2xl mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{selected.title}</h3>
                    
                   <a   href={selected.issuerLink}
                      target="_blank"
                      className="text-purple-300 text-sm hover:text-purple-200 inline-flex items-center gap-1"
                    >
                      {selected.issuer} <FiExternalLink className="text-xs" />
                    </a>
                    <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                      <FiCalendar /> {selected.date}
                    </p>
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed text-sm mb-4">
                  {selected.description}
                </p>

                <div className="flex gap-2 flex-wrap">
                  {selected.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
