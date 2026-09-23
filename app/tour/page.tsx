"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiMapPin, FiCalendar, FiMap, FiMaximize2 } from "react-icons/fi";
import { PageBackdrop, PageHeader, GlowCard, ease } from "@/components/PageShell";
import { Lightbox, ModalGallery, lightboxItem } from "@/components/Carousel";

type TourItem = {
  place: string;
  location: string;
  date: string;
  description: string;
  images: string[];
};

const tours: TourItem[] = [
  {
    place: "Saint Martin's Island",
    location: "Cox's Bazar, Bangladesh",
    date: "2025",
    description:
      "Explored Bangladesh's only coral island, capturing its clear waters, coconut trees, and stunning sunsets with the TH Team for a travel shoot.",
    images: ["/tour/tour1-1.jpg", "/tour/tour1-2.jpg"],
  },
  {
    place: "Rangamati",
    location: "Chittagong Hill Tracts, Bangladesh",
    date: "2025",
    description:
      "A trip through the hills and Kaptai Lake, exploring tribal culture and scenic landscapes.",
    images: ["/tour/tour2-1.jpg", "/tour/tour2-2.jpg"],
  },
];

export default function TourPage() {
  const [selected, setSelected] = useState<TourItem | null>(null);

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <PageBackdrop />

      <PageHeader
        eyebrow="Travel"
        title="My"
        accent="Tour"
        description="A visual journal of the places I have explored — capturing new landscapes, cultures, and memories along the way."
      />

      {tours.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {tours.map((tour, i) => (
            <GlowCard key={tour.place} delay={i * 0.08}>
              <button
                type="button"
                onClick={() => setSelected(tour)}
                aria-label={tour.place}
                className="btn-press block w-full cursor-pointer text-left"
              >
                <div className="relative h-44 w-full overflow-hidden bg-black/40 sm:h-48">
                  <Image
                    src={tour.images[0]}
                    alt={tour.place}
                    fill
                    sizes="(max-width: 640px) 100vw, 400px"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                  {/* Scrim keeps the photo readable where the card text begins */}
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/15 to-transparent"
                  />
                  <span aria-hidden className="carousel-sheen pointer-events-none absolute inset-0" />
                  <span
                    aria-hidden
                    className="absolute right-3 top-3 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full bg-black/60 text-sm text-white opacity-0 ring-1 ring-white/10 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    <FiMaximize2 />
                  </span>
                </div>

                <div className="relative p-5">
                  <h3 className="text-base font-semibold leading-snug text-white">{tour.place}</h3>
                  <p className="mt-1.5 flex items-start gap-1.5 text-xs text-purple-300">
                    <FiMapPin className="mt-0.5 flex-shrink-0 text-purple-400/80 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:scale-110" /> {tour.location}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500 transition-colors duration-500 group-hover:text-gray-400">
                    <FiCalendar className="flex-shrink-0 transition-transform duration-500 group-hover:scale-110" /> {tour.date}
                  </p>
                  <span
                    aria-hidden
                    className="mt-3 block h-px w-8 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500 group-hover:w-16"
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
                  "radial-gradient(ellipse 60% 70% at 50% 0%, rgba(168,85,247,0.18), transparent 70%)",
              }}
            />
            <motion.span
              aria-hidden
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15, ease }}
              className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/25 to-pink-500/25 text-2xl text-purple-200 ring-1 ring-purple-400/30"
            >
              <FiMap />
            </motion.span>
            <span
              aria-hidden
              className="relative mx-auto mt-6 block h-px w-16 bg-gradient-to-r from-transparent via-purple-400/60 to-transparent"
            />
          </GlowCard>
        </div>
      )}

      <Lightbox
        open={selected !== null}
        onClose={() => setSelected(null)}
        contentKey={selected?.place}
        wide
      >
        {selected && (
          <>
            <ModalGallery images={selected.images} alt={selected.place} fit="cover" />

            <div className="relative border-t border-white/5 p-5 sm:p-7 md:p-8">
              <motion.div {...lightboxItem(0)}>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/25 bg-purple-500/10 px-3 py-1 text-[11px] uppercase tracking-wider text-purple-200">
                  <FiCalendar className="text-xs" /> {selected.date}
                </span>
                <h3 className="mt-3 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-2xl font-semibold leading-snug text-transparent sm:text-3xl">
                  {selected.place}
                </h3>
              </motion.div>

              <motion.p
                {...lightboxItem(1)}
                className="mt-4 inline-flex items-start gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-purple-200"
              >
                <FiMapPin className="mt-0.5 flex-shrink-0 text-purple-400/80" /> {selected.location}
              </motion.p>

              <motion.div {...lightboxItem(2)} className="mt-6 border-t border-white/5 pt-6">
                <p className="max-w-2xl text-sm leading-[1.8] text-gray-300 md:text-[0.95rem]">
                  {selected.description}
                </p>
              </motion.div>
            </div>
          </>
        )}
      </Lightbox>
    </section>
  );
}
