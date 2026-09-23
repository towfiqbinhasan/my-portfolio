"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiMaximize2 } from "react-icons/fi";
import highlightsData from "@/data/highlighter.json";
import { SectionHeading } from "@/components/HomePreviews";
import { Carousel, Lightbox, lightboxItem } from "@/components/Carousel";

type HighlightItem = {
  image: string;
  caption: string;
  details: string;
};

const highlights: HighlightItem[] = highlightsData as HighlightItem[];

export default function Highlights() {
  const [index, setIndex] = useState<number | null>(null);
  const selected = index === null ? null : highlights[index];
  const step = (delta: number) =>
    setIndex((i) => (i === null ? i : (i + delta + highlights.length) % highlights.length));

  return (
    <section className="relative overflow-hidden py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="06"
          eyebrow="Moments"
          title="Highlighter"
          accent="Points"
          text="Conferences, presentations and milestones worth remembering."
          center
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <Carousel
          count={highlights.length}
          speed={34}
          renderCard={(i, key) => {
            const item = highlights[i];
            return (
              <button
                key={key}
                onClick={() => setIndex(i)}
                draggable={false}
                className="carousel-card group relative h-[270px] w-[240px] flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 text-left xs:h-[300px] xs:w-[270px] sm:h-[340px] sm:w-[330px]"
              >
                <Image
                  src={item.image}
                  alt={item.caption}
                  fill
                  sizes="330px"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  draggable={false}
                />
                {/* Scrim so the caption stays readable over any photo */}
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-500 group-hover:from-black/95"
                />
                <span aria-hidden className="carousel-sheen pointer-events-none absolute inset-0" />

                <span className="absolute right-3 top-3 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full bg-black/60 text-sm text-white opacity-0 ring-1 ring-white/15 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <FiMaximize2 />
                </span>

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="mb-2 block h-px w-8 bg-gradient-to-r from-purple-400 to-cyan-400 transition-all duration-500 group-hover:w-16" />
                  <p className="line-clamp-3 text-sm leading-snug text-gray-100">{item.caption}</p>
                  <span className="mt-2 block text-[11px] text-purple-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Read the story
                  </span>
                </div>
              </button>
            );
          }}
        />
      </motion.div>

      <Lightbox
        open={selected !== null}
        onClose={() => setIndex(null)}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
        position={index === null ? undefined : `${index + 1} / ${highlights.length}`}
        contentKey={index ?? undefined}
        wide
      >
        {selected && (
          <>
            <motion.div
              {...lightboxItem(0)}
              className="relative h-60 w-full bg-[#08080c] xs:h-72 sm:h-80 md:h-[26rem]"
            >
              <Image
                src={selected.image}
                alt={selected.caption}
                fill
                sizes="(min-width: 1024px) 896px, 100vw"
                className="object-contain"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0e0e14] via-[#0e0e14]/40 to-transparent"
              />
            </motion.div>

            <div className="relative border-t border-white/5 p-5 sm:p-7 md:p-8">
              <motion.div {...lightboxItem(1)}>
                <span
                  aria-hidden
                  className="block h-px w-10 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400"
                />
                <h3 className="mt-4 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-xl font-semibold leading-snug text-transparent sm:text-2xl">
                  {selected.caption}
                </h3>
              </motion.div>

              <motion.div {...lightboxItem(2)} className="mt-5 border-t border-white/5 pt-6">
                <p className="max-w-3xl text-sm leading-[1.8] text-gray-300 md:text-[0.95rem]">
                  {selected.details}
                </p>
              </motion.div>
            </div>
          </>
        )}
      </Lightbox>
    </section>
  );
}
