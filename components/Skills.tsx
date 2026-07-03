"use client";
import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="py-24 px-6 max-w-4xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold mb-6 text-center"
      >
        About <span className="text-purple-400">Me</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-gray-400 text-center leading-relaxed"
      >
        আমি একজন Computer Science এর ছাত্র, যার ওয়েব ডেভেলপমেন্ট এবং সমস্যা সমাধানের প্রতি গভীর আগ্রহ আছে।
        আমি নতুন টেকনোলজি শিখতে এবং বাস্তব জীবনের সমস্যা সমাধানে প্রজেক্ট তৈরি করতে পছন্দ করি।
      </motion.p>
    </section>
  );
}