"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";
import { FiExternalLink, FiGithub, FiX, FiChevronLeft, FiChevronRight, FiFileText } from "react-icons/fi";
import projectsData from "@/data/project.json";

type Category =
  | "Web Tech"
  | "JAVA"
  | "C#"
  | "Data Base"
  | "HCI"
  | "Computer Graphics"
  | "Data Science"
  | "IEC"
  | "Device"
  | "DLC"
  | "Micro"
  | "Software Engineering";

const categoryList: Category[] = [
  "Web Tech",
  "JAVA",
  "C#",
  "Data Base",
  "HCI",
  "Computer Graphics",
  "Data Science",
  "IEC",
  "Device",
  "DLC",
  "Micro",
  "Software Engineering",
];

type Project = {
  title: string;
  desc: string;
  details: string;
  tech: string[];
  live: string;
  github: string;
  doc?: { label: string; url: string }[];
  images: string[];
  video?: string;
  field: "CSE" | "EEE";
  categories: Category[];
};

const projects: Project[] = projectsData as Project[];

function showNotDeployedToast() {
  toast("This project has not been deployed live yet.", {
    icon: "🚧",
  });
}

function ProjectCard({
  project,
  index,
  onClick,
}: {
  project: Project;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      className="relative cursor-pointer bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-400 transition-all duration-300 group"
    >
      <div className="relative w-full h-40 rounded-lg mb-4 overflow-hidden bg-black/40">
        {project.images[0] && (
          <Image
            src={project.images[0]}
            alt={project.title}
            fill
            sizes="400px"
            className="object-contain group-hover:scale-105 transition duration-500"
          />
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
      <p className="text-gray-400 text-sm mb-4">{project.desc}</p>
      <div className="flex gap-2 flex-wrap mb-4">
        {project.tech.map((t) => (
          <span key={t} className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
            {t}
          </span>
        ))}
      </div>
      <div className="flex gap-4">
        {project.live !== "#" ? (
          <a href={project.live}
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            className="flex items-center gap-1 text-sm hover:text-purple-400"
          >
            <FiExternalLink /> Live
          </a>
        ) : (
          <span
            onClick={(e) => {
              e.stopPropagation();
              showNotDeployedToast();
            }}
            className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer hover:text-gray-300"
          >
            <FiExternalLink /> Live
          </span>
        )}

        <a href={project.github}
          onClick={(e) => e.stopPropagation()}
          target="_blank"
          className="flex items-center gap-1 text-sm hover:text-purple-400"
        >
          <FiGithub /> Code
        </a>
        {project.doc &&
          project.doc.map((d) => (
            <a key={d.url}
              href={d.url}
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              className="flex items-center gap-1 text-sm hover:text-purple-400"
            >
              <FiFileText /> {d.label}
            </a>
          ))}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="mt-4 w-full text-center text-sm px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition font-medium"
      >
        View Details
      </button>
    </motion.div>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % project.images.length);
  const prev = () => setCurrent((c) => (c - 1 + project.images.length) % project.images.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center px-6 py-10 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-2xl w-full bg-[#111117] border border-white/10 rounded-2xl overflow-hidden my-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-purple-500/60 rounded-full text-xl transition"
        >
          <FiX />
        </button>

        <div className="relative w-full h-72 md:h-96 bg-black/40">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <Image
                src={project.images[current]}
                alt={project.title}
                fill
                sizes="672px"
                className="object-contain"
              />
            </motion.div>
          </AnimatePresence>

          {project.images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-black/50 hover:bg-purple-500/60 rounded-full transition"
              >
                <FiChevronLeft />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-black/50 hover:bg-purple-500/60 rounded-full transition"
              >
                <FiChevronRight />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {project.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={
                      i === current
                        ? "w-5 h-2 rounded-full transition bg-purple-400"
                        : "w-2 h-2 rounded-full transition bg-white/40"
                    }
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {project.video && (
          <div className="relative w-full bg-black/60 border-t border-white/10">
            <video controls className="w-full max-h-96" poster={project.images[0]}>
              <source src={project.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <div className="p-6 md:p-8">
          <h3 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {project.title}
          </h3>

          <div className="flex gap-2 flex-wrap mb-4">
            {project.tech.map((t) => (
              <span key={t} className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                {t}
              </span>
            ))}
          </div>

          <p className="text-gray-300 leading-relaxed text-sm md:text-base mb-6">
            {project.details}
          </p>

          <div className="flex gap-4 flex-wrap">
            {project.live !== "#" ? (
              <a href={project.live}
                target="_blank"
                className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition"
              >
                <FiExternalLink /> Live Demo
              </a>
            ) : (
              <span
                onClick={showNotDeployedToast}
                className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full border border-white/20 text-gray-500 cursor-pointer hover:bg-white/5"
              >
                <FiExternalLink /> Not Deployed
              </span>
            )}

            <a href={project.github}
              target="_blank"
              className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/10 transition"
            >
              <FiGithub /> View Code
            </a>
            {project.doc &&
              project.doc.map((d) => (
                <a key={d.url}
                  href={d.url}
                  target="_blank"
                  className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/10 transition"
                >
                  <FiFileText /> {d.label}
                </a>
              ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const filteredProjects = activeCategory
    ? projects.filter((p) => p.categories.includes(activeCategory))
    : projects;

  const cseProjects = filteredProjects.filter((p) => p.field === "CSE");
  const eeeProjects = filteredProjects.filter((p) => p.field === "EEE");

  const toggleCategory = (cat: Category) => {
    setActiveCategory((prev) => (prev === cat ? null : cat));
  };

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-4 text-center"
      >
        My Projects <span className="text-purple-400">Summary</span>
      </motion.h1>
      <p className="text-gray-400 text-center mb-8 max-w-xl mx-auto">
        Since my second semester of university, I have been actively developing a diverse range of projects across
        both Computer Science (CS) and Electrical and Electronic Engineering (EEE). My journey began with
        foundational software development using Java in Notepad++ and advanced into computer graphics using C++.
        Over time, I expanded my expertise into web development using HTML, CSS, JavaScript, and PHP, and I am
        currently focused on mastering full-stack development and UI/UX design. In addition to software, I have
        experience in data-driven work using Oracle Database and conducting data science research with R Studio. My
        technical background also includes hands-on engineering projects involving microprocessors, Digital Logic
        circuit (DLC), and introduction to electric circuits (IEC). Detailed documentation and source code for all
        my work, including full working details, are available on my GitHub via the repository links provided
        below.
      </p>

      <div className="flex flex-wrap justify-center gap-2.5 mb-20">
        {categoryList.map((cat) => {
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={
                active
                  ? "text-sm px-4 py-2 rounded-full border transition-all duration-200 bg-gradient-to-r from-purple-500 to-pink-500 border-transparent text-white shadow-[0_0_15px_-2px_rgba(168,85,247,0.6)]"
                  : "text-sm px-4 py-2 rounded-full border transition-all duration-200 border-white/15 text-gray-300 hover:border-purple-400 hover:text-purple-300"
              }
            >
              {cat}
            </button>
          );
        })}
      </div>

      {cseProjects.length > 0 && (
        <div className="mb-20">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
            CSE <span className="text-purple-400">Projects</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {cseProjects.map((p, i) => (
              <ProjectCard key={p.title} project={p} index={i} onClick={() => setSelected(p)} />
            ))}
          </div>
        </div>
      )}

      {eeeProjects.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
            EEE <span className="text-purple-400">Projects</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {eeeProjects.map((p, i) => (
              <ProjectCard key={p.title} project={p} index={i} onClick={() => setSelected(p)} />
            ))}
          </div>
        </div>
      )}

      {filteredProjects.length === 0 && (
        <p className="text-center text-gray-500 py-16">
          No projects found for this category.
        </p>
      )}

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}