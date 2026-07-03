"use client";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export default function Contact() {
  return (
    <section className="py-24 px-6 max-w-3xl mx-auto text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-4xl font-bold mb-6"
      >
        Get In <span className="text-purple-400">Touch</span>
      </motion.h1>

      <p className="text-gray-400 mb-10">
        কোনো প্রজেক্ট বা কোলাবরেশনের জন্য যোগাযোগ করতে চাইলে নিচের যেকোনো মাধ্যমে মেসেজ করো।
      </p>

      <div className="flex flex-col md:flex-row justify-center gap-6">
        <div className="flex items-center gap-3 justify-center bg-white/5 border border-white/10 rounded-xl px-6 py-4">
          <FiMail className="text-purple-400" /> youremail@example.com
        </div>
        <div className="flex items-center gap-3 justify-center bg-white/5 border border-white/10 rounded-xl px-6 py-4">
          <FiPhone className="text-purple-400" /> +880 1XXXXXXXXX
        </div>
        <div className="flex items-center gap-3 justify-center bg-white/5 border border-white/10 rounded-xl px-6 py-4">
          <FiMapPin className="text-purple-400" /> Dhaka, Bangladesh
        </div>
      </div>
    </section>
  );
}