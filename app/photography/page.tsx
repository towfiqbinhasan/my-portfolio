"use client";
import { motion } from "framer-motion";

const photos = [
  "/photos/photo1.jpg",
  "/photos/photo2.jpg",
  "/photos/photo3.jpg",
];

export default function Photography() {
  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-12 text-center">
        My <span className="text-purple-400">Photography</span>
      </h1>

      <div className="grid md:grid-cols-3 gap-4">
        {photos.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="aspect-square bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl overflow-hidden border border-white/10"
          ></motion.div>
        ))}
      </div>
      <p className="text-gray-500 text-sm text-center mt-6">
        নিজের ছবি public/photos/ ফোল্ডারে রেখে img ট্যাগ যোগ করো
      </p>
    </section>
  );
}