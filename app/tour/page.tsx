"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiX, FiMapPin, FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";

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
  const [current, setCurrent] = useState(0);

  function openTour(tour: TourItem) {
    setSelected(tour);
    setCurrent(0);
  }

  return (
    <section className="py-16 px-6 max-w-6xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold mb-4 text-center"
      >
        My <span className="text-purple-400">Tour</span>
      </motion.h1>
      <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">
        A visual journal of the places I have explored — capturing new landscapes, cultures, and memories along the way.
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tours.map((tour, i) => (
          <motion.div
            key={tour.place}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            onClick={() => openTour(tour)}
            className="cursor-pointer bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-400 transition group"
          >
            <div className="relative w-full h-48 overflow-hidden bg-black/40">
              <Image
                src={tour.images[0]}
                alt={tour.place}
                fill
                sizes="400px"
                className="object-cover group-hover:scale-105 transition duration-500"
              />
            </div>
            <div className="p-5">
              <h3 className="text-base font-semibold mb-1">{tour.place}</h3>
              <p className="text-purple-300 text-xs flex items-center gap-1 mb-1">
                <FiMapPin /> {tour.location}
              </p>
              <p className="text-gray-500 text-xs flex items-center gap-1">
                <FiCalendar /> {tour.date}
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
                      src={selected.images[current]}
                      alt={selected.place}
                      fill
                      sizes="672px"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                {selected.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrent((c) => (c - 1 + selected.images.length) % selected.images.length)
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-black/50 hover:bg-purple-500/60 rounded-full transition"
                    >
                      <FiChevronLeft />
                    </button>
                    <button
                      onClick={() => setCurrent((c) => (c + 1) % selected.images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-black/50 hover:bg-purple-500/60 rounded-full transition"
                    >
                      <FiChevronRight />
                    </button>
                  </>
                )}
              </div>

              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {selected.place}
                </h3>
                <p className="text-purple-300 text-sm flex items-center gap-1 mb-1">
                  <FiMapPin /> {selected.location}
                </p>
                <p className="text-gray-500 text-xs flex items-center gap-1 mb-4">
                  <FiCalendar /> {selected.date}
                </p>
                <p className="text-gray-300 leading-relaxed text-sm">
                  {selected.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}