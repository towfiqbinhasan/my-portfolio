"use client";
import { useState } from "react";
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
} from "react-icons/fi";

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
    color: "from-pink-500 to-rose-500",
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
    color: "from-fuchsia-500 to-purple-500",
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
    color: "from-indigo-500 to-pink-500",
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
    color: "from-purple-500 to-fuchsia-500",
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
    color: "from-fuchsia-500 to-rose-500",
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
    color: "from-purple-500 via-pink-500 to-fuchsia-500",
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

export default function CVPage() {
  const [selected, setSelected] = useState<SelectedCV | null>(null);
  const [loading, setLoading] = useState(false);

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
    } catch (err) {
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
        Request My <span className="text-purple-400">CV</span>
      </motion.h1>
      <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
        Choose the category that matches your goals and submit a quick request to access the CV tailored for it. Each category includes two versions — one with a profile photo, and a Harvard-style version without a photo. Once approved, you'll receive a secure download link by email.
      </p>

      <div className="space-y-12">
        {cvCategories.map((category, catIndex) => {
          const CategoryIcon = category.icon;
          return (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: catIndex * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 hover:border-purple-400/40 transition"
            >
              <div className="flex items-center gap-4 mb-8">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                >
                  <CategoryIcon className="text-2xl text-white" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">{category.title}</h2>
                  <p className="text-gray-400 text-sm">{category.subtitle}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {category.versions.map((version) => {
                  const VersionIcon = version.icon;
                  return (
                    <div
                      key={version.fileKey}
                      className="group bg-black/30 border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-purple-400 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition">
                          <VersionIcon className="text-purple-300 text-lg" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm md:text-base">
                            {version.label}
                          </h3>
                          <p className="text-gray-500 text-xs mt-0.5">
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
                        className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center hover:opacity-90 hover:scale-110 transition"
                        title={`Request ${category.title} CV - ${version.label}`}
                      >
                        <FiDownload className="text-white" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Request Form Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center px-6 py-10 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-[#111117] border border-white/10 rounded-2xl overflow-hidden my-auto p-6 md:p-8"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-purple-500/40 rounded-full transition"
              >
                <FiX />
              </button>

              <h3 className="text-xl font-semibold mb-1">Request Access</h3>
              <p className="text-purple-300 text-sm mb-6">
                {selected.categoryTitle} — {selected.versionLabel}
              </p>

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
                    Why do you need this CV?
                  </label>
                  <textarea
                    name="reason"
                    required
                    rows={3}
                    placeholder="e.g. Job application at XYZ Company"
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
                      <FiSend /> Submit Request
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}