"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  FiX,
  FiExternalLink,
  FiCalendar,
  FiMapPin,
  FiBriefcase,
  FiSend,
  FiLock,
} from "react-icons/fi";
import experienceData from "@/data/experience.json";
import { PageBackdrop, PageHeader, GlowCard, ease } from "@/components/PageShell";
import { lightboxItem } from "@/components/Carousel";

type Experience = {
  role: string;
  company: string;
  companyLink: string;
  employmentType: string;
  duration: string;
  location: string;
  mode: string;
  logo?: string;
  logoText: string;
  logoBg: string;
  description: string;
  skills: string[];
  offerLetter?: { label: string; fileKey: string };
};

const experiences: Experience[] = experienceData as Experience[];

/** Shared shell for both modals so they read like the home-page lightbox. */
const backdropClass =
  "fixed inset-0 flex items-center justify-center overflow-y-auto bg-black/80 px-3 py-6 sm:px-6 sm:py-10";
const panelClass =
  "modal-rim relative my-auto w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e14] shadow-2xl shadow-black/70 sm:rounded-3xl";
const scrollAreaClass =
  "modal-scroll max-h-[88vh] overflow-y-auto overscroll-contain sm:max-h-[85vh]";
const closeButtonClass =
  "absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-lg text-white/80 ring-1 ring-white/10 backdrop-blur transition hover:bg-purple-500/60 hover:text-white sm:right-4 sm:top-4 sm:h-10 sm:w-10 sm:text-xl";
const chipClass =
  "inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-2.5 py-1 text-[11px] text-gray-400 ring-1 ring-white/10";
/** Form control shared by the offer-letter request modal. */
const fieldClass =
  "field-input w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-purple-400/60 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-purple-500/35";
const fieldLabelClass = "field-label mb-2 block text-sm text-gray-400";

function CompanyLogo({
  exp,
  size = "md",
}: {
  exp: Experience;
  size?: "md" | "lg";
}) {
  const dims = size === "lg" ? "w-14 h-14 rounded-2xl text-lg" : "w-11 h-11 rounded-xl text-sm";
  const imgSize = size === "lg" ? 56 : 44;

  if (exp.logo) {
    return (
      <div
        className={`relative ${dims} flex-shrink-0 overflow-hidden border border-white/10 bg-white/10 shadow-lg transition-transform duration-500 ease-out group-hover:scale-105`}
      >
        <Image
          src={exp.logo}
          alt={`${exp.company} logo`}
          fill
          sizes={`${imgSize}px`}
          className="object-contain p-1.5"
        />
      </div>
    );
  }

  return (
    <div
      className={`${dims} bg-gradient-to-br ${exp.logoBg} flex flex-shrink-0 items-center justify-center font-bold text-white shadow-lg transition-transform duration-500 ease-out group-hover:scale-105`}
    >
      {exp.logoText}
    </div>
  );
}

type RequestTarget = { company: string; fileKey: string; label: string };

function RequestAccessModal({
  target,
  onClose,
}: {
  target: RequestTarget;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const reduce = useReducedMotion();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const reason = formData.get("reason") as string;

    setLoading(true);
    try {
      const res = await fetch("/api/offer-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          reason,
          company: target.company,
          fileKey: target.fileKey,
        }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Request sent! You'll receive an email once it's approved.");
        onClose();
      } else {
        toast.error(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      transition={{ duration: 0.35, ease }}
      onClick={onClose}
      className={`${backdropClass} z-[110]`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16, transition: { duration: 0.22, ease: "easeIn" } }}
        transition={reduce ? { duration: 0.2, ease } : { type: "spring", stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className={`${panelClass} max-w-4xl`}
      >
        <button onClick={onClose} aria-label="Close" className={closeButtonClass}>
          <FiX />
        </button>

        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-28 h-56 w-56 rounded-full bg-purple-600/20 blur-3xl"
        />

        <div className={scrollAreaClass}>
          <div className="relative p-5 sm:p-7 md:p-8">
            <motion.div {...lightboxItem(0)}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/25 bg-purple-500/10 px-3 py-1 text-[11px] font-medium tracking-wide text-purple-200">
                <FiLock className="text-xs" /> Restricted Document
              </span>
              <h3 className="mt-3 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text pr-10 text-2xl font-semibold leading-snug text-transparent sm:text-3xl">
                Request Access
              </h3>
              <p className="mt-2 text-sm leading-[1.8] text-purple-300/90">
                {target.company} — {target.label}
              </p>
            </motion.div>

            <motion.form
              {...lightboxItem(1)}
              onSubmit={handleSubmit}
              className="mt-7 space-y-5 border-t border-white/5 pt-6"
            >
              <div>
                <label htmlFor="offer-name" className={fieldLabelClass}>
                  Name
                </label>
                <input
                  id="offer-name"
                  type="text"
                  name="name"
                  required
                  placeholder="Your name"
                  className={fieldClass}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="offer-email" className={fieldLabelClass}>
                    Email
                  </label>
                  <input
                    id="offer-email"
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="offer-phone" className={fieldLabelClass}>
                    Phone Number
                  </label>
                  <input
                    id="offer-phone"
                    type="tel"
                    name="phone"
                    required
                    placeholder="+880 1XXXXXXXXX"
                    className={fieldClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="offer-reason" className={fieldLabelClass}>
                  Why do you need to see this offer letter?
                </label>
                <textarea
                  id="offer-reason"
                  name="reason"
                  required
                  rows={3}
                  placeholder="e.g. Verifying internship credentials for a job application"
                  className={`${fieldClass} resize-none`}
                />
              </div>

              <div className="border-t border-white/5 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_24px_-6px_rgba(168,85,247,0.9)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[14rem]"
                >
                  {loading ? "Sending..." : (
                    <>
                      <FiSend /> Submit Request
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ExperienceModal({
  exp,
  onClose,
  onRequestAccess,
}: {
  exp: Experience;
  onClose: () => void;
  onRequestAccess: (target: RequestTarget) => void;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      transition={{ duration: 0.35, ease }}
      onClick={onClose}
      className={`${backdropClass} z-[100]`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16, transition: { duration: 0.22, ease: "easeIn" } }}
        transition={reduce ? { duration: 0.2, ease } : { type: "spring", stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className={`${panelClass} max-w-2xl`}
      >
        <button onClick={onClose} aria-label="Close" className={closeButtonClass}>
          <FiX />
        </button>

        <div className={scrollAreaClass}>
          <div className={`h-1.5 w-full bg-gradient-to-r ${exp.logoBg}`} />

          <motion.div
            {...lightboxItem(0)}
            className="border-b border-white/5 p-5 sm:p-7 md:p-8"
          >
            <div className="flex items-start gap-4">
              <CompanyLogo exp={exp} size="lg" />
              <div className="min-w-0">
                <h3 className="mb-1 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text pr-10 text-xl font-semibold leading-snug text-transparent md:text-2xl">
                  {exp.role}
                </h3>

                <a
                  href={exp.companyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-purple-300 transition-colors hover:text-purple-200 hover:underline hover:underline-offset-2"
                >
                  {exp.company} · {exp.employmentType}
                  <FiExternalLink className="text-xs" />
                </a>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className={chipClass}>
                    <FiCalendar className="flex-shrink-0" /> {exp.duration}
                  </span>
                  <span className={chipClass}>
                    <FiMapPin className="flex-shrink-0" /> {exp.location}
                    {exp.mode ? ` · ${exp.mode}` : ""}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="p-5 sm:p-7 md:p-8">
            <motion.p
              {...lightboxItem(1)}
              className="max-w-3xl text-sm leading-[1.8] text-gray-300 md:text-[0.95rem]"
            >
              {exp.description}
            </motion.p>

            <motion.div {...lightboxItem(2)} className="mt-7">
              <h4 className="mb-3 text-sm font-semibold text-purple-300">Skills Gained</h4>
              <div className="flex flex-wrap gap-2">
                {exp.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-purple-500/10 px-3 py-1.5 text-xs text-purple-200 ring-1 ring-purple-400/25 transition hover:bg-purple-500/20 hover:text-white hover:ring-purple-400/50"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              {...lightboxItem(3)}
              className="mt-7 flex flex-wrap gap-2.5 border-t border-white/5 pt-6 sm:gap-3"
            >
              <a
                href={exp.companyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 px-4 py-2.5 text-xs font-medium text-white shadow-[0_0_20px_-6px_rgba(168,85,247,0.9)] transition hover:opacity-90 sm:px-5 sm:text-sm"
              >
                <FiExternalLink className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />{" "}
                Visit {exp.company}
              </a>
              {exp.offerLetter && (
                <button
                  onClick={() =>
                    onRequestAccess({
                      company: exp.company,
                      fileKey: exp.offerLetter!.fileKey,
                      label: exp.offerLetter!.label,
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 text-xs transition hover:border-purple-400/60 hover:bg-purple-500/15 hover:text-white sm:px-5 sm:text-sm"
                >
                  <FiLock className="text-xs" /> Request {exp.offerLetter.label}
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ExperiencePage() {
  const [selected, setSelected] = useState<Experience | null>(null);
  const [requestTarget, setRequestTarget] = useState<RequestTarget | null>(null);

  // Escape closes the top-most modal, and the page behind it stays put
  useEffect(() => {
    if (!selected && !requestTarget) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (requestTarget) setRequestTarget(null);
      else setSelected(null);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected, requestTarget]);

  return (
    <section className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <PageBackdrop />

      <PageHeader
        eyebrow="Work"
        title="My"
        accent="Experience"
        description="A timeline of the roles, internships, and teaching positions that have shaped my professional journey from full-stack development internships to hands-on software engineering and academic mentoring. Internship offer letters are available on request for verification purposes."
      />

      <div className="relative">
        {/* Timeline spine, drawn as the section comes into view */}
        <motion.div
          aria-hidden
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.4, ease }}
          className="absolute left-4 top-0 bottom-0 w-px origin-top bg-gradient-to-b from-purple-500 via-cyan-400 to-transparent sm:left-6 md:left-1/2 md:-translate-x-1/2"
        />

        <div className="space-y-8 sm:space-y-12">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className={
                i % 2 === 1
                  ? "relative flex flex-col md:flex-row-reverse items-start gap-4 sm:gap-6"
                  : "relative flex flex-col md:flex-row items-start gap-4 sm:gap-6"
              }
            >
              {/* Node on the spine */}
              <motion.span
                aria-hidden
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2, ease }}
                className="absolute left-4 top-7 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.8)] ring-4 ring-[#0a0a0f] sm:left-6 sm:top-8 md:left-1/2"
              />

              <div className="ml-10 w-[calc(100%-2.5rem)] sm:ml-16 sm:w-[calc(100%-4rem)] md:ml-0 md:w-1/2">
                <GlowCard delay={(i % 2) * 0.1} className={i % 2 === 1 ? "md:ml-10" : "md:mr-10"}>
                  <span
                    aria-hidden
                    className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${exp.logoBg} opacity-70`}
                  />
                  <span aria-hidden className="carousel-sheen pointer-events-none absolute inset-0" />

                  <div className="relative p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                      <CompanyLogo exp={exp} size="md" />
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold leading-snug text-white sm:text-lg">
                          {exp.role}
                        </h3>

                        <a
                          href={exp.companyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs text-purple-300 transition-colors hover:text-purple-200 hover:underline hover:underline-offset-2 sm:text-sm"
                        >
                          {exp.company} · {exp.employmentType}
                          <FiExternalLink className="text-[10px]" />
                        </a>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className={chipClass}>
                        <FiCalendar className="flex-shrink-0" /> {exp.duration}
                      </span>
                      <span className={chipClass}>
                        <FiMapPin className="flex-shrink-0" /> {exp.location}
                        {exp.mode ? ` · ${exp.mode}` : ""}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {exp.skills.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-purple-500/10 px-2 py-1 text-[11px] text-purple-300 ring-1 ring-purple-400/20"
                        >
                          {s}
                        </span>
                      ))}
                      {exp.skills.length > 3 && (
                        <span className="rounded-full bg-white/5 px-2 py-1 text-[11px] text-gray-500 ring-1 ring-white/10">
                          +{exp.skills.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
                      <button
                        onClick={() => setSelected(exp)}
                        className="group/btn inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-purple-200 transition hover:border-purple-400/60 hover:bg-purple-500/15 hover:text-white sm:text-sm"
                      >
                        <FiBriefcase className="text-sm transition-transform duration-300 group-hover/btn:-translate-y-0.5" />
                        View Details
                      </button>

                      {exp.offerLetter && (
                        <button
                          onClick={() =>
                            setRequestTarget({
                              company: exp.company,
                              fileKey: exp.offerLetter!.fileKey,
                              label: exp.offerLetter!.label,
                            })
                          }
                          className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/15 px-3 py-1.5 text-[11px] text-purple-300 ring-1 ring-purple-400/25 transition hover:bg-purple-500/25 hover:text-white"
                        >
                          <FiLock className="text-[10px]" /> Request Offer Letter
                        </button>
                      )}
                    </div>
                  </div>
                </GlowCard>
              </div>

              <div className="hidden md:block md:w-1/2" />
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <ExperienceModal
            exp={selected}
            onClose={() => setSelected(null)}
            onRequestAccess={(target) => {
              setSelected(null);
              setRequestTarget(target);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {requestTarget && (
          <RequestAccessModal target={requestTarget} onClose={() => setRequestTarget(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
