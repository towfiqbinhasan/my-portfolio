"use client";
import { motion } from "framer-motion";
import { FiCamera } from "react-icons/fi";
import { PageBackdrop, PageHeader, GlowCard, ease } from "@/components/PageShell";

const photos = [
  "/photos/photo1.jpg",
  "/photos/photo2.jpg",
  "/photos/photo3.jpg",
];

export default function Photography() {
  return (
    <section className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <PageBackdrop />

      <PageHeader eyebrow="Gallery" title="My" accent="Photography" />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {photos.map((src, i) => (
          <GlowCard key={src} delay={i * 0.08} className="aspect-square">
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-br from-purple-600/25 via-transparent to-cyan-500/25"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(168,85,247,0.18),transparent_65%)]"
            />
            <span aria-hidden className="carousel-sheen pointer-events-none absolute inset-0" />
            <span className="absolute inset-0 flex items-center justify-center">
              <FiCamera
                aria-hidden
                className="text-3xl text-white/15 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 group-hover:text-white/30 sm:text-4xl"
              />
            </span>
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0a0a0f] to-transparent"
            />
          </GlowCard>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease }}
        className="text-gray-500 text-sm text-center mt-6"
      >
         public/photos/ 
      </motion.p>
    </section>
  );
}
