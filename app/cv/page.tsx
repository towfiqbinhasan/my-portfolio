"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiDownload,
  FiUser,
  FiFileText,
  FiCpu,
  FiCode,
  FiDatabase,
  FiLayers,
  FiX,
  FiSend,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import { PageBackdrop, PageHeader, GlowCard, ease } from "@/components/PageShell";
import { lightboxItem } from "@/components/Carousel";

type CVVersion = {
  label: string;
  description: string;
  fileKey: string;
  icon: React.ElementType;
};

type CVCategory = {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  versions: CVVersion[];
};

const cvCategories: CVCategory[] = [
  {
    title: "Networking",
    subtitle: "Network Engineering & Infrastructure",
    icon: FiCpu,
    color: "from-purple-500 to-indigo-500",
    versions: [
      {
        label: "With Photo",
        description: "Standard CV format including a profile photo",
        fileKey: "networking-with-photo.pdf",
        icon: FiUser,
      },
      {
        label: "Harvard Style",
        description: "Clean, photo-free Harvard-style academic CV",
        fileKey: "networking-harvard.pdf",
        icon: FiFileText,
      },
    ],
  },
  {
    title: "Software Engineering",
    subtitle: "Full-Stack Development & Systems Design",
    icon: FiCode,
    color: "from-cyan-500 to-teal-500",
    versions: [
      {
        label: "With Photo",
        description: "Standard CV format including a profile photo",
        fileKey: "software-engineering-with-photo.pdf",
        icon: FiUser,
      },
      {
        label: "Harvard Style",
        description: "Clean, photo-free Harvard-style academic CV",
        fileKey: "software-engineering-harvard.pdf",
        icon: FiFileText,
      },
    ],
  },
  {
    title: "Information Systems",
    subtitle: "Data, Databases & Information Management",
    icon: FiDatabase,
    color: "from-violet-500 to-purple-500",
    versions: [
      {
        label: "With Photo",
        description: "Standard CV format including a profile photo",
        fileKey: "information-systems-with-photo.pdf",
        icon: FiUser,
      },
      {
        label: "Harvard Style",
        description: "Clean, photo-free Harvard-style academic CV",
        fileKey: "information-systems-harvard.pdf",
        icon: FiFileText,
      },
    ],
  },
  {
    title: "Networking + Software Engineering",
    subtitle: "Combined profile covering both disciplines",
    icon: FiLayers,
    color: "from-indigo-500 to-cyan-500",
    versions: [
      {
        label: "With Photo",
        description: "Standard CV format including a profile photo",
        fileKey: "networking-se-with-photo.pdf",
        icon: FiUser,
      },
      {
        label: "Harvard Style",
        description: "Clean, photo-free Harvard-style academic CV",
        fileKey: "networking-se-harvard.pdf",
        icon: FiFileText,
      },
    ],
  },
  {
    title: "Networking + Information Systems",
    subtitle: "Combined profile covering both disciplines",
    icon: FiLayers,
    color: "from-purple-500 to-sky-500",
    versions: [
      {
        label: "With Photo",
        description: "Standard CV format including a profile photo",
        fileKey: "networking-is-with-photo.pdf",
        icon: FiUser,
      },
      {
        label: "Harvard Style",
        description: "Clean, photo-free Harvard-style academic CV",
        fileKey: "networking-is-harvard.pdf",
        icon: FiFileText,
      },
    ],
  },
  {
    title: "Information Systems + Software Engineering",
    subtitle: "Combined profile covering both disciplines",
    icon: FiLayers,
    color: "from-sky-500 to-cyan-500",
    versions: [
      {
        label: "With Photo",
        description: "Standard CV format including a profile photo",
        fileKey: "is-se-with-photo.pdf",
        icon: FiUser,
      },
      {
        label: "Harvard Style",
        description: "Clean, photo-free Harvard-style academic CV",
        fileKey: "is-se-harvard.pdf",
        icon: FiFileText,
      },
    ],
  },
  {
    title: "Networking + Software Engineering + Information Systems",
    subtitle: "Complete all-in-one combined profile",
    icon: FiLayers,
    color: "from-purple-500 via-cyan-400 to-teal-500",
    versions: [
      {
        label: "With Photo",
        description: "Standard CV format including a profile photo",
        fileKey: "all-combined-with-photo.pdf",
        icon: FiUser,
      },
      {
        label: "Harvard Style",
        description: "Clean, photo-free Harvard-style academic CV",
        fileKey: "all-combined-harvard.pdf",
        icon: FiFileText,
      },
    ],
  },
];

type SelectedCV = {
  categoryTitle: string;
  versionLabel: string;
  fileKey: string;
};

const fieldClass =
  "field-input w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-purple-400/60 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-purple-500/35";
const labelClass = "field-label mb-2 block text-sm text-gray-400";
const fieldIconClass =
  "field-icon pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500";

export default function CVPage() {
  const [selected, setSelected] = useState<SelectedCV | null>(null);
  const [loading, setLoading] = useState(false);

  // Escape closes the request modal; the page behind it stays put.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const reason = formData.get("reason") as string;

    setLoading(true);

    try {
      const res = await fetch("/api/cv-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          reason,
          category: `${selected.categoryTitle} - ${selected.versionLabel}`,
          fileKey: selected.fileKey,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Request sent! You'll receive an email once it's approved.");
        setSelected(null);
        (e.target as HTMLFormElement).reset();
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
    <section className="relative px-4 sm:px-6 py-12 sm:py-16 max-w-6xl mx-auto">
      <PageBackdrop />

      <PageHeader
        eyebrow="Resume"
        title="Request My"
        accent="CV"
        description={
          <p>
            Choose the category that matches your goals and submit a quick request to access the CV tailored for it. Each category includes two versions — one with a profile photo, and a Harvard-style version without a photo. Once approved, you&apos;ll receive a secure download link by email.
          </p>
        }
      />

      <div className="space-y-6 sm:space-y-8">
        {cvCategories.map((category, catIndex) => {
          const CategoryIcon = category.icon;
          return (
            <GlowCard
              key={category.title}
              delay={Math.min(catIndex, 3) * 0.08}
              lift={false}
              className="p-5 sm:p-7 md:p-8"
            >
              <div
                aria-hidden
                className={`pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gradient-to-br ${category.color} opacity-[0.14] blur-3xl`}
              />

              <div className="relative mb-6 flex items-center gap-4 sm:mb-8">
                <div
                  className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${category.color} text-xl text-white shadow-lg shadow-purple-500/20 sm:h-14 sm:w-14 sm:text-2xl`}
                >
                  <CategoryIcon />
                </div>
                <div className="min-w-0">
                  <h2 className="break-words text-lg font-bold leading-snug xs:text-xl md:text-2xl">
                    {category.title}
                  </h2>
                  <p className="mt-0.5 text-xs text-gray-400 sm:text-sm">{category.subtitle}</p>
                </div>
              </div>

              <div className="relative grid gap-4 md:grid-cols-2">
                {category.versions.map((version) => {
                  const VersionIcon = version.icon;
                  const isSelected = selected?.fileKey === version.fileKey;
                  return (
                    <div
                      key={version.fileKey}
                      className={`group/version relative flex items-center justify-between gap-3 rounded-2xl border p-4 transition duration-300 sm:gap-4 sm:p-5 ${
                        isSelected
                          ? "border-purple-400/60 bg-purple-500/10 shadow-[0_0_0_1px_rgba(168,85,247,0.25)]"
                          : "border-white/10 bg-black/25 hover:border-purple-400/50 hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                        <div
                          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ring-1 ring-white/10 transition sm:h-11 sm:w-11 ${
                            isSelected
                              ? "bg-purple-500/25 text-purple-200"
                              : "bg-white/5 text-purple-300 group-hover/version:bg-purple-500/20"
                          }`}
                        >
                          <VersionIcon className="text-lg" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold md:text-base">
                            {version.label}
                          </h3>
                          <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                            {version.description}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setSelected({
                            categoryTitle: category.title,
                            versionLabel: version.label,
                            fileKey: version.fileKey,
                          })
                        }
                        className="btn-press btn-shine flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/50"
                        title={`Request ${category.title} CV - ${version.label}`}
                      >
                        <FiDownload />
                      </button>
                    </div>
                  );
                })}
              </div>
            </GlowCard>
          );
        })}
      </div>

      {/* Request Form Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.35, ease }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 px-3 py-6 sm:px-6 sm:py-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16, transition: { duration: 0.22, ease: "easeIn" } }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="modal-rim relative my-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e14] shadow-2xl shadow-black/70 sm:rounded-3xl"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-24 -top-28 h-56 w-56 rounded-full bg-purple-600/20 blur-3xl"
              />

              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="btn-press absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-lg text-white/80 ring-1 ring-white/10 backdrop-blur hover:bg-purple-500/60 hover:text-white sm:right-4 sm:top-4 sm:h-10 sm:w-10 sm:text-xl"
              >
                <FiX />
              </button>

              <div className="modal-scroll max-h-[88vh] overflow-y-auto overscroll-contain sm:max-h-[85vh]">
                <div className="relative p-5 sm:p-7 md:p-8">
                  <motion.div {...lightboxItem(0)}>
                    <span
                      aria-label="Curriculum vitae"
                      className="inline-flex h-7 items-center justify-center rounded-full border border-purple-400/25 bg-purple-500/10 px-3 text-sm text-purple-200"
                    >
                      <FiFileText />
                    </span>
                    <h3 className="mt-3 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text pr-10 text-2xl font-semibold leading-snug text-transparent sm:text-3xl">
                      Request Access
                    </h3>
                    <p className="mt-2 text-sm leading-[1.8] text-purple-300">
                      {selected.categoryTitle} — {selected.versionLabel}
                    </p>
                  </motion.div>

                  <motion.form
                    {...lightboxItem(1)}
                    onSubmit={handleSubmit}
                    className="mt-7 space-y-5 border-t border-white/5 pt-6"
                  >
                    <motion.div {...lightboxItem(2)} className="field-group">
                      <label htmlFor="cv-name" className={labelClass}>Name</label>
                      <div className="relative">
                        <FiUser className={fieldIconClass} />
                        <input
                          id="cv-name"
                          type="text"
                          name="name"
                          required
                          placeholder="Your name"
                          className={fieldClass}
                        />
                      </div>
                    </motion.div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <motion.div {...lightboxItem(3)} className="field-group">
                        <label htmlFor="cv-email" className={labelClass}>Email</label>
                        <div className="relative">
                          <FiMail className={fieldIconClass} />
                          <input
                            id="cv-email"
                            type="email"
                            name="email"
                            required
                            placeholder="you@example.com"
                            className={fieldClass}
                          />
                        </div>
                      </motion.div>

                      <motion.div {...lightboxItem(4)} className="field-group">
                        <label htmlFor="cv-phone" className={labelClass}>
                          Phone Number
                        </label>
                        <div className="relative">
                          <FiPhone className={fieldIconClass} />
                          <input
                            id="cv-phone"
                            type="tel"
                            name="phone"
                            required
                            placeholder="+880 1XXXXXXXXX"
                            className={fieldClass}
                          />
                        </div>
                      </motion.div>
                    </div>

                    <motion.div {...lightboxItem(5)} className="field-group">
                      <label htmlFor="cv-reason" className={labelClass}>
                        Why do you need this CV?
                      </label>
                      <div className="relative">
                        <FiFileText className="field-icon pointer-events-none absolute left-4 top-4 text-gray-500" />
                        <textarea
                          id="cv-reason"
                          name="reason"
                          required
                          rows={3}
                          placeholder="e.g. Job application at XYZ Company"
                          className={`${fieldClass} resize-none`}
                        />
                      </div>
                    </motion.div>

                    <motion.div {...lightboxItem(6)} className="border-t border-white/5 pt-6">
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-press btn-shine inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_24px_-6px_rgba(168,85,247,0.9)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[14rem]"
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
                            <FiSend /> Submit Request
                          </span>
                        )}
                      </button>
                    </motion.div>
                  </motion.form>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
