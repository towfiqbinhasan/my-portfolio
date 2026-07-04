"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiMail,
  FiSend,
} from "react-icons/fi";
import { FaWhatsapp, FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";

const socials = [
  {
    icon: FaWhatsapp,
    label: "01533xxxxxxxxx",
    href: "https://wa.me/qr/IHA6ZSEDQZ57M1",
    color: "text-green-400",
  },
  {
    icon: FaGithub,
    label: "towfiqbinhxxxx",
    href: "https://github.com/towfiqbinhasan",
    color: "text-gray-300",
  },
  {
    icon: FaLinkedin,
    label: "MD Towfiq Bin Hasan",
    href: "https://www.linkedin.com/in/md-towfiq-bin-hasan-531ba5265/",
    color: "text-blue-400",
  },
  {
    icon: FaFacebook,
    label: "MD Towfiq Bin Hasan",
    href: "https://www.facebook.com/share/18Zth7mnQQ/",
    color: "text-blue-500",
  },
];

export default function Contact() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("access_key", "3746002e-7683-47fe-8bfd-ee59ae46e180");
    formData.append("subject", "New message from portfolio contact form");
    formData.append("to", "towfiqbinhasan@gmail.com");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();

      if (result.success) {
        toast.success("Message sent successfully!");
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-16 px-6 max-w-6xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold mb-4 text-center"
      >
        Get In <span className="text-purple-400">Touch</span>
      </motion.h1>
      <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">
        Want to collaborate on a project or just say hi? Send a message using the form below, or reach out directly through social media.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Info + Socials */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col justify-between"
        >
          <div>
            <p className="text-2xl font-semibold mb-2">
              I'm always in this spot.
            </p>
            <p className="text-gray-400 text-sm mb-10">
              📖 Feedback is fuel for growth.
            </p>

            <a
              href="mailto:towfiqbinhasan@gmail.com"
              className="flex items-center gap-3 bg-black/30 border border-white/10 rounded-xl px-5 py-4 mb-8 hover:border-purple-400 transition group"
            >
              <FiMail className="text-purple-400 text-xl" />
              <span className="text-gray-200 group-hover:text-white transition">
                towfiqbinhasan@gmail.com
              </span>
            </a>

            <div className="space-y-3">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label + s.href}
                    href={s.href}
                    target="_blank"
                    className="flex items-center gap-4 bg-black/30 border border-white/10 rounded-xl px-5 py-4 hover:border-purple-400 transition group"
                  >
                    <Icon className={`text-2xl ${s.color}`} />
                    <span className="text-gray-300 group-hover:text-white transition text-sm">
                      {s.label}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          <p className="text-gray-600 text-xs mt-10 text-center">
            Portfolio created by Google Sides
          </p>
        </motion.div>

        {/* Right: Feedback Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-8"
        >
          <h2 className="text-xl font-semibold mb-6">Send a Feedback</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Your name"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="+880 1XXXXXXXXX"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">
                Comment
              </label>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Write your message..."
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition rounded-lg px-6 py-3 font-medium disabled:opacity-50"
            >
              {loading ? (
                "Sending..."
              ) : (
                <>
                  <FiSend /> Send Message
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
