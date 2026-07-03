"use client";
import { motion } from "framer-motion";

const gadgets = [
  { name: "Laptop", desc: "যেই ল্যাপটপ ব্যবহার করো তার মডেল/স্পেক লিখো" },
  { name: "Smartphone", desc: "তোমার ফোনের মডেল লিখো" },
  { name: "Camera", desc: "তোমার ক্যামেরার মডেল লিখো (photography এর জন্য)" },
];

export default function Gadgets() {
  return (
    <section className="py-16 px-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-12 text-center">
        My <span className="text-purple-400">Gadgets</span>
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {gadgets.map((g, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:border-purple-400 transition"
          >
            <h3 className="text-lg font-semibold mb-2">{g.name}</h3>
            <p className="text-gray-400 text-sm">{g.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}