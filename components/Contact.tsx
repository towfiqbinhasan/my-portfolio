"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FiMail,
  FiSend,
  FiUser,
  FiPhone,
  FiMessageSquare,
} from "react-icons/fi";
import { FaWhatsapp, FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import {
  FiGlobe,
} from "react-icons/fi";
import { PageBackdrop, PageHeader, GlowCard } from "@/components/PageShell";
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
  {
    icon: FiGlobe,
    label: "Old Portfolio (Google Sites)",
    href: "https://sites.google.com/view/mdtowfiqbinhasanportfolio/home",
    color: "text-sky-400",
  },
];

const fieldClass =
  "field-input w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-sky-400/60 focus:bg-white/[0.06] focus:outline-none focus:shadow-[0_0_0_3px_rgba(14, 165, 233,0.12)]";
const labelClass = "field-label mb-2 block text-sm text-gray-400";
const fieldIconClass =
  "field-icon pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500";

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
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative px-4 sm:px-6 py-12 sm:py-16 max-w-6xl mx-auto">
      <PageBackdrop />

      <PageHeader
        eyebrow="Say hello"
        title="Get In"
        accent="Touch"
        description={
          <p>
            Want to collaborate on a project or just say hi? Send a message using the form below, or reach out directly through social media.
          </p>
        }
      />

      <div className="grid gap-5 md:grid-cols-2">
        {/* Left: Info + Socials */}
        <GlowCard lift={false} className="flex flex-col justify-between p-6 sm:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-sky-600/20 blur-3xl"
          />

          <div className="relative">
            <p className="text-xl font-semibold xs:text-2xl">
              I&apos;m always in this spot.
            </p>
            <p className="mt-2 mb-8 text-sm text-gray-400 sm:mb-10">
              📖 Feedback is fuel for growth.
            </p>

            <a
              href="mailto:towfiqbinhasan@gmail.com"
              className="group mb-8 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 transition duration-300 hover:-translate-y-0.5 hover:border-sky-400/60 hover:bg-sky-500/10 sm:px-5"
            >
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/5 text-lg text-sky-400 ring-1 ring-white/10 transition group-hover:bg-sky-500/20">
                <FiMail />
              </span>
              <span className="min-w-0 break-all text-sm text-gray-200 transition group-hover:text-white sm:text-base">
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
                    className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 transition duration-300 hover:-translate-y-0.5 hover:border-sky-400/60 hover:bg-white/[0.07] sm:gap-4 sm:px-5 sm:py-4"
                  >
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 transition group-hover:bg-sky-500/20">
                      <Icon className={`text-xl ${s.color}`} />
                    </span>
                    <span className="min-w-0 break-words text-sm text-gray-300 transition group-hover:text-white">
                      {s.label}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          <p className="relative mt-10 text-center text-xs text-gray-600">
            Portfolio created by Google Sides
          </p>
        </GlowCard>

        {/* Right: Feedback Form */}
        <GlowCard delay={0.12} lift={false} className="p-6 sm:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -bottom-24 h-52 w-52 rounded-full bg-cyan-500/15 blur-3xl"
          />

          <div className="relative">
            <h2 className="text-xl font-semibold">Send a Feedback</h2>
            <div
              aria-hidden
              className="mt-4 mb-6 h-px w-full bg-gradient-to-r from-sky-400/50 via-white/10 to-transparent"
            />

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="field-group"
              >
                <label className={labelClass}>Name</label>
                <div className="relative">
                  <FiUser className={fieldIconClass} />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your name"
                    className={fieldClass}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="field-group"
              >
                <label className={labelClass}>Email</label>
                <div className="relative">
                  <FiMail className={fieldIconClass} />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    className={fieldClass}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.19, ease: [0.22, 1, 0.36, 1] }}
                className="field-group"
              >
                <label className={labelClass}>
                  Phone Number
                </label>
                <div className="relative">
                  <FiPhone className={fieldIconClass} />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+880 1XXXXXXXXX"
                    className={fieldClass}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
                className="field-group"
              >
                <label className={labelClass}>
                  Comment
                </label>
                <div className="relative">
                  <FiMessageSquare className="field-icon pointer-events-none absolute left-4 top-4 text-gray-500" />
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="Write your message..."
                    className={`${fieldClass} resize-none`}
                  />
                </div>
              </motion.div>

              <button
                type="submit"
                disabled={loading}
                className="btn-press btn-shine mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 hover:shadow-sky-500/45 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="relative flex items-center gap-2">
                    <span
                      aria-hidden
                      className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                    />
                    Sending...
                  </span>
                ) : (
                  <span className="relative flex items-center gap-2">
                    <FiSend /> Send Message
                  </span>
                )}
              </button>
            </form>
          </div>
        </GlowCard>
      </div>
    </section>
  );
}
