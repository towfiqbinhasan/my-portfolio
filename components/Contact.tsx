"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { motion, useReducedMotion } from "framer-motion";
import {
  FiMail,
  FiSend,
  FiUser,
  FiPhone,
  FiMessageSquare,
} from "react-icons/fi";
import { FaWhatsapp, FaGithub, FaLinkedin, FaFacebook, FaStar } from "react-icons/fa";
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

const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

/** Directions the sparks fly when a star is picked. */
const sparks = Array.from({ length: 8 }, (_, i) => {
  const a = (i / 8) * Math.PI * 2;
  return { x: Math.cos(a) * 20, y: Math.sin(a) * 20 };
});

/**
 * 1–5 star picker. Stars drop in when scrolled into view, a golden wave keeps rolling across
 * them until a rating is picked, the chosen star pops with a burst of sparks, and the picked
 * stars keep a soft twinkle.
 */
function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(0);
  const [burst, setBurst] = useState(0); // bumped on every pick to replay the spark burst
  const shown = hover || value;
  const idle = !shown && !reduce;

  return (
    <div className="relative flex items-center justify-between gap-2 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 sm:gap-3 sm:px-4">
      {/* Warm glow that fills the box in proportion to the score */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 bg-gradient-to-r from-amber-400/15 via-amber-400/5 to-transparent"
        animate={{ width: `${(shown / 5) * 100}%` }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      />

      <div
        role="radiogroup"
        aria-label="Rating"
        className="relative flex shrink-0 items-center gap-0.5 sm:gap-1.5"
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((n, i) => {
          const active = n <= shown;
          return (
            <motion.span
              key={n}
              className="relative flex"
              initial={reduce ? false : { opacity: 0, y: -14, rotate: -40, scale: 0.4 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 380, damping: 16, delay: 0.3 + i * 0.08 }}
            >
              <motion.button
                type="button"
                role="radio"
                aria-checked={value === n}
                aria-label={`${n} star${n > 1 ? "s" : ""} – ${ratingLabels[n]}`}
                onClick={() => {
                  onChange(n);
                  setBurst((b) => b + 1);
                }}
                onMouseEnter={() => setHover(n)}
                onFocus={() => setHover(n)}
                onBlur={() => setHover(0)}
                whileHover={reduce ? undefined : { scale: 1.2, y: -2, rotate: -8 }}
                whileTap={{ scale: 0.85 }}
                animate={
                  reduce
                    ? undefined
                    : value === n
                      ? { scale: [1, 1.4, 1], rotate: [0, 18, 0] }
                      : { scale: 1, rotate: 0 }
                }
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative rounded-md p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60"
              >
                <FaStar
                  className={`text-[21px] transition-[color,filter] duration-300 sm:text-[26px] ${
                    active
                      ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                      : "text-white/15"
                  }`}
                />

                {/* Idle invitation: a golden wave rolls across the empty stars */}
                {idle && (
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 flex items-center justify-center p-0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.55, 0] }}
                    transition={{ duration: 1, delay: 1.2 + i * 0.14, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }}
                  >
                    <FaStar className="text-[21px] text-amber-300 sm:text-[26px]" />
                  </motion.span>
                )}

                {/* Soft twinkle on the picked stars */}
                {!reduce && !hover && n <= value && (
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 flex items-center justify-center p-0.5"
                    animate={{ opacity: [0, 0.7, 0] }}
                    transition={{ duration: 1.6, delay: i * 0.2, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
                  >
                    <FaStar className="text-[21px] text-yellow-100 blur-[1px] sm:text-[26px]" />
                  </motion.span>
                )}
              </motion.button>

              {/* Spark burst from the star just picked */}
              {!reduce && value === n && burst > 0 && (
                <span key={burst} aria-hidden className="pointer-events-none absolute inset-0">
                  {sparks.map((s, k) => (
                    <motion.span
                      key={k}
                      className="absolute left-1/2 top-1/2 -ml-[2px] -mt-[2px] h-1 w-1 rounded-full bg-amber-300 shadow-[0_0_6px_rgba(252,211,77,0.9)]"
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{ x: s.x, y: s.y, opacity: 0, scale: 0.3 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  ))}
                </span>
              )}
            </motion.span>
          );
        })}
      </div>

      <motion.span
        key={shown}
        initial={{ opacity: 0, y: 8, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 22 }}
        className={`relative shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold sm:px-3 sm:text-xs ${
          shown
            ? "bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/30"
            : "text-gray-500"
        }`}
      >
        {shown ? (
          <>
            {/* The score prefix drops on the narrowest phones so the label always fits beside the stars */}
            <span className="hidden xs:inline">{shown}/5 · </span>
            {ratingLabels[shown]}
          </>
        ) : (
          "Tap to rate"
        )}
      </motion.span>
    </div>
  );
}

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!rating) {
      toast.error("Please give a rating before sending.");
      return;
    }
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("rating", `${"★".repeat(rating)}${"☆".repeat(5 - rating)} (${rating}/5 – ${ratingLabels[rating]})`);
    formData.append("access_key", "3746002e-7683-47fe-8bfd-ee59ae46e180");
    formData.append("subject", `New feedback (${rating}/5 ★) from portfolio contact form`);
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
        setRating(0);
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
                <span className={labelClass}>Rating</span>
                <StarRating value={rating} onChange={setRating} />
                <input type="hidden" name="rating" value={rating || ""} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.33, ease: [0.22, 1, 0.36, 1] }}
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
                className="send-btn btn-press btn-shine group mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
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
                    <span className="send-plane">
                      <FiSend />
                    </span>
                    <span className="send-label">Send Message</span>
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
