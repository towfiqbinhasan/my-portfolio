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
       I am a meticulous computer science and engineering student at AIUB, majoring in data science. I have a strong passion for my field, particularly in machine learning, data mining, and research. My technical expertise includes C++, Java, C#, and full-stack web development, along with a solid understanding of DSA and database management. I have also participated in several academic conferences and have shared my projects on GitHub.Beyond my technical life, I am an adventurous traveler. I have a dream of going on a world tour, and I have already successfully traveled across all of Bangladesh with my travel group, TH Team. My experience as a traveler has made me a more adaptable and fast learner. With a mix of strong analytical skills, teaching experience, and a motivated mindset, I am eager to bring my technical knowledge into a professional environment.

      </motion.p>
    </section>
  );
}