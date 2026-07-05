"use client";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative overflow-hidden">
      {/* Animated gradient blobs */}
      <motion.div
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -50, 40, 0],
          y: [0, 40, -30, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, 30, -30, 0],
          y: [0, -20, 20, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-fuchsia-600/20 rounded-full blur-3xl"
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Profile Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="relative mb-8"
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          {/* Glowing gradient ring */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full blur-md opacity-70 animate-pulse"></div>

          <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-black/50 bg-gradient-to-br from-purple-900 to-pink-900">
            <Image
              src="/DSC00106.jpg"
              alt="Profile Picture"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-purple-400 mb-4"
      >
        Hello, I'm
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
      >
        Md. Towfiq Bin Hasan
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative text-lg md:text-xl text-gray-400 mt-4 max-w-xl"
      >
        CS Student | Passionate about Web Development & Problem Solving|<br />
        Researcher | Traveler | Photographer | Filmmaker
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="relative flex flex-wrap justify-center gap-4 mt-8"
      >
        <Link href="/projects" className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-medium hover:opacity-90 transition">
          View Projects
        </Link>
        <Link href="/research" className="px-6 py-3 border border-white/20 rounded-full font-medium hover:bg-white/10 transition">
          View Research Paper
        </Link>
        <Link href="/certificate" className="px-6 py-3 border border-white/20 rounded-full font-medium hover:bg-white/10 transition">
          View Certificates
        </Link>
        <Link href="/contact" className="px-6 py-3 border border-white/20 rounded-full font-medium hover:bg-white/10 transition">
          Contact Me
        </Link>
      </motion.div>

      <div className="relative flex gap-6 mt-10 text-2xl text-gray-400">
        <a href="https://github.com/towfiqbinhasan" target="_blank" className="hover:text-purple-400 transition"><FaGithub /></a>
        <a href="https://www.linkedin.com/in/md-towfiq-bin-hasan-531ba5265/" target="_blank" className="hover:text-purple-400 transition"><FaLinkedin /></a>
        <a href="https://www.facebook.com/share/18Zth7mnQQ/" target="_blank" className="hover:text-purple-400 transition"><FaFacebook /></a>
        <a href="mailto:towfiqbinhasan@gmail.com" className="hover:text-purple-400 transition"><FiMail /></a>
        <a href="https://wa.me/qr/IHA6ZSEDQZ57M1" target="_blank" className="hover:text-purple-400 transition"><FaWhatsapp /></a>
      </div>
    </section>
  );
}