"use client";
import { motion } from "framer-motion";
import {
  FiDownload,
  FiUser,
  FiFileText,
  FiCpu,
  FiCode,
  FiDatabase,
  FiLayers,
} from "react-icons/fi";

type CVVersion = {
  label: string;
  description: string;
  file: string;
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
        file: "/cv/networking-with-photo.pdf",
        icon: FiUser,
      },
      {
        label: "Harvard Style",
        description: "Clean, photo-free Harvard-style academic CV",
        file: "/cv/networking-harvard.pdf",
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
        file: "/cv/software-engineering-with-photo.pdf",
        icon: FiUser,
      },
      {
        label: "Harvard Style",
        description: "Clean, photo-free Harvard-style academic CV",
        file: "/cv/software-engineering-harvard.pdf",
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
        file: "/cv/information-systems-with-photo.pdf",
        icon: FiUser,
      },
      {
        label: "Harvard Style",
        description: "Clean, photo-free Harvard-style academic CV",
        file: "/cv/information-systems-harvard.pdf",
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
        file: "/cv/networking-se-with-photo.pdf",
        icon: FiUser,
      },
      {
        label: "Harvard Style",
        description: "Clean, photo-free Harvard-style academic CV",
        file: "/cv/networking-se-harvard.pdf",
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
        file: "/cv/networking-is-with-photo.pdf",
        icon: FiUser,
      },
      {
        label: "Harvard Style",
        description: "Clean, photo-free Harvard-style academic CV",
        file: "/cv/networking-is-harvard.pdf",
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
        file: "/cv/is-se-with-photo.pdf",
        icon: FiUser,
      },
      {
        label: "Harvard Style",
        description: "Clean, photo-free Harvard-style academic CV",
        file: "/cv/is-se-harvard.pdf",
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
        file: "/cv/all-combined-with-photo.pdf",
        icon: FiUser,
      },
      {
        label: "Harvard Style",
        description: "Clean, photo-free Harvard-style academic CV",
        file: "/cv/all-combined-harvard.pdf",
        icon: FiFileText,
      },
    ],
  },
];

export default function CVPage() {
  return (
    <section className="py-16 px-6 max-w-6xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold mb-4 text-center"
      >
        Download My <span className="text-purple-400">CV</span>
      </motion.h1>
      <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
        Choose the category that matches your goals and download the CV tailored for it. Each category includes two versions — one with a profile photo, and a Harvard-style version without a photo — so you can pick whichever best suits the application.
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
              transition={{ duration: 0.6, delay: catIndex * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 hover:border-purple-400/40 transition"
            >
              {/* Category Header */}
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

              {/* CV Version Cards */}
              <div className="grid md:grid-cols-2 gap-5">
                {category.versions.map((version) => {
                  const VersionIcon = version.icon;
                  return (
                    <div
                      key={version.file}
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

                      
                      <a  href={version.file}
                        download
                        className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center hover:opacity-90 hover:scale-110 transition"
                        title={`Download ${category.title} CV - ${version.label}`}
                      >
                        <FiDownload className="text-white" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}