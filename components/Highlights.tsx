"use client";
import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useAnimationFrame,
} from "framer-motion";
import Image from "next/image";
import { FiX } from "react-icons/fi";
import highlightsData from "@/data/highlighter.json";

type HighlightItem = {
  image: string;
  caption: string;
  details: string;
};

const highlights: HighlightItem[] = highlightsData as HighlightItem[];

const loopItems = [...highlights, ...highlights, ...highlights];

const CARD_WIDTH = 340;
const GAP = 24;
const ITEM_SPAN = CARD_WIDTH + GAP;
const LOOP_WIDTH = ITEM_SPAN * highlights.length;

// Wraps any position back into the safe [-LOOP_WIDTH, 0] range,
// always by an exact multiple of LOOP_WIDTH so the swap is invisible.
function wrapPosition(value: number) {
  let v = value % LOOP_WIDTH;
  if (v > 0) v -= LOOP_WIDTH;
  return v;
}

export default function Highlights() {
  const [selected, setSelected] = useState<HighlightItem | null>(null);
  const isInteracting = useRef(false);
  const x = useMotionValue(0);

  // Continuous right-to-left auto-scroll, pauses while the user drags
  useAnimationFrame((_, delta) => {
    if (isInteracting.current) return;
    const next = wrapPosition(x.get() - (delta / 1000) * 40);
    x.set(next);
  });

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
          className="flex gap-6 cursor-grab active:cursor-grabbing"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -Infinity, right: Infinity }}
          dragElastic={0.05}
          onPointerDown={() => {
            isInteracting.current = true;
          }}
          onDrag={() => {
            // Wrap continuously during drag so it never runs out of items,
            // whether the user drags left-to-right or right-to-left.
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
          {loopItems.map((item, i) => (
            <button
              key={i}
              onClick={() => setSelected(item)}
              className="min-w-[280px] md:min-w-[340px] bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-400 transition text-left select-none"
              draggable={false}
            >
              <div className="relative w-full h-64 pointer-events-none">
                <Image
                  src={item.image}
                  alt={item.caption}
                  fill
                  sizes="340px"
                  className="object-cover"
                  draggable={false}
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
                  src={selected.image}
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