"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";
import { FiExternalLink, FiGithub, FiX, FiFileText } from "react-icons/fi";
import projectsData from "@/data/project.json";
import { PageBackdrop, PageHeader, GlowCard, ease } from "@/components/PageShell";
import { ModalGallery, lightboxItem } from "@/components/Carousel";

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

/** Text-link underline that draws itself in from the cursor side on hover. */
const linkUnderline =
  "relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:content-[''] group-hover/link:after:origin-left group-hover/link:after:scale-x-100";

function showNotDeployedToast() {
  toast("This project has not been deployed live yet.", {
    icon: "🚧",
  });
}

/** Small section title with the gradient bar, matching the home page. */
function SectionTitle({ title, accent }: { title: string; accent: string }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease }}
      className="mb-6 flex items-center gap-3 text-xl font-bold tracking-tight sm:mb-8 sm:text-2xl"
    >
      <span className="h-7 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-b from-purple-500 to-cyan-400 shadow-[0_0_14px_-2px_rgba(168,85,247,0.8)] sm:h-8 sm:w-2" />
      {title}{" "}
      <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
        {accent}
      </span>
    </motion.h2>
  );
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
    <GlowCard delay={(index % 3) * 0.1} className="flex flex-col">
      <div onClick={onClick} className="flex flex-1 cursor-pointer flex-col">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
          {project.images[0] && (
            <Image
              src={project.images[0]}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          )}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/20 to-transparent"
          />
          <span aria-hidden className="carousel-sheen pointer-events-none absolute inset-0" />
        </div>

        <div className="relative flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="text-base font-semibold leading-snug text-white sm:text-lg">
            {project.title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-gray-400 sm:text-sm">{project.desc}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <span
                key={t}
                className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-gray-300 ring-1 ring-white/10 transition duration-300 hover:-translate-y-0.5 hover:bg-purple-500/15 hover:text-white hover:ring-purple-400/40"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5 text-gray-400">
            {project.live !== "#" ? (
              <a
                href={project.live}
                onClick={(e) => e.stopPropagation()}
                target="_blank"
                className="group/link flex items-center gap-1.5 text-xs transition-colors duration-300 hover:text-purple-300 sm:text-sm"
              >
                <FiExternalLink className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                <span className={linkUnderline}>Live</span>
              </a>
            ) : (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  showNotDeployedToast();
                }}
                className="group/link flex cursor-pointer items-center gap-1.5 text-xs text-gray-500 transition-colors duration-300 hover:text-gray-300 sm:text-sm"
              >
                <FiExternalLink className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                <span className={linkUnderline}>Live</span>
              </span>
            )}

            <a
              href={project.github}
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              className="group/link flex items-center gap-1.5 text-xs transition-colors duration-300 hover:text-purple-300 sm:text-sm"
            >
              <FiGithub className="transition-transform duration-300 group-hover/link:scale-110" />
              <span className={linkUnderline}>Code</span>
            </a>
            {project.doc &&
              project.doc.map((d) => (
                <a
                  key={d.url}
                  href={d.url}
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  className="group/link flex items-center gap-1.5 text-xs transition-colors duration-300 hover:text-purple-300 sm:text-sm"
                >
                  <FiFileText className="transition-transform duration-300 group-hover/link:-translate-y-0.5" />
                  <span className={linkUnderline}>{d.label}</span>
                </a>
              ))}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="btn-press btn-shine mt-5 w-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 px-4 py-2.5 text-center text-xs font-medium text-white shadow-[0_0_20px_-6px_rgba(168,85,247,0.9)] hover:opacity-90 hover:shadow-[0_0_28px_-6px_rgba(34,211,238,0.9)] sm:text-sm"
          >
            View Details
          </button>
        </div>
      </div>
    </GlowCard>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  // Escape to close, page scroll locked (the gallery handles its own arrow keys).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      transition={{ duration: 0.35, ease }}
      onClick={onClose}
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
        <button
          onClick={onClose}
          aria-label="Close"
          className="btn-press group/close absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-lg text-white/80 ring-1 ring-white/10 backdrop-blur hover:bg-purple-500/60 hover:text-white sm:right-4 sm:top-4 sm:h-10 sm:w-10 sm:text-xl"
        >
          <FiX className="transition-transform duration-300 group-hover/close:rotate-90" />
        </button>

        <div className="modal-scroll max-h-[88vh] overflow-y-auto overscroll-contain sm:max-h-[85vh]">
          <ModalGallery images={project.images} alt={project.title} fit="contain" />

          {project.video && (
            <div className="relative w-full border-t border-white/10 bg-black/60">
              <video controls className="w-full max-h-96" poster={project.images[0]}>
                <source src={project.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          <div className="relative border-t border-white/5 p-5 sm:p-7 md:p-8">
            <motion.div {...lightboxItem(0)}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/25 bg-purple-500/10 px-3 py-1 text-[11px] uppercase tracking-wider text-purple-200">
                {project.field}
              </span>
              <h3 className="mt-3 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-2xl font-semibold leading-snug text-transparent sm:text-3xl">
                {project.title}
              </h3>
            </motion.div>

            <motion.div {...lightboxItem(1)} className="mt-4 flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-white/5 px-2.5 py-1 text-[11px] text-gray-300 ring-1 ring-white/10 transition hover:bg-purple-500/15 hover:text-white hover:ring-purple-400/40"
                >
                  {t}
                </span>
              ))}
            </motion.div>

            <motion.p
              {...lightboxItem(2)}
              className="mt-6 max-w-3xl text-sm leading-[1.8] text-gray-300 md:text-[0.95rem]"
            >
              {project.details}
            </motion.p>

            <motion.div {...lightboxItem(3)} className="mt-7 flex flex-wrap gap-2.5 border-t border-white/5 pt-6 sm:gap-3">
              {project.live !== "#" ? (
                <a
                  href={project.live}
                  target="_blank"
                  className="btn-press btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 px-4 py-2.5 text-xs font-medium text-white shadow-[0_0_20px_-6px_rgba(168,85,247,0.9)] hover:opacity-90 hover:shadow-[0_0_28px_-6px_rgba(34,211,238,0.9)] sm:px-5 sm:text-sm"
                >
                  <FiExternalLink /> Live Demo
                </a>
              ) : (
                <span
                  onClick={showNotDeployedToast}
                  className="btn-press inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 text-xs text-gray-500 hover:border-white/25 hover:bg-white/5 hover:text-gray-300 sm:px-5 sm:text-sm"
                >
                  <FiExternalLink /> Not Deployed
                </span>
              )}

              <a
                href={project.github}
                target="_blank"
                className="btn-press inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 text-xs hover:border-purple-400/60 hover:bg-purple-500/15 hover:text-white sm:px-5 sm:text-sm"
              >
                <FiGithub /> View Code
              </a>
              {project.doc &&
                project.doc.map((d) => (
                  <a
                    key={d.url}
                    href={d.url}
                    target="_blank"
                    className="btn-press inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 text-xs hover:border-purple-400/60 hover:bg-purple-500/15 hover:text-white sm:px-5 sm:text-sm"
                  >
                    <FiFileText /> {d.label}
                  </a>
                ))}
            </motion.div>
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
    <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <PageBackdrop />

      <PageHeader
        eyebrow="Project"
        title="My Projects"
        accent="Summary"
        description={
          <p>
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
        }
      >
        <div className="flex flex-wrap justify-center gap-2 xs:gap-2.5">
          {categoryList.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={
                  active
                    ? "btn-press relative rounded-full border border-transparent px-3 py-1.5 text-xs font-medium text-white xs:px-4 xs:py-2 xs:text-sm"
                    : "btn-press relative rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-400 hover:border-purple-400/50 hover:bg-white/[0.06] hover:text-purple-200 xs:px-4 xs:py-2 xs:text-sm"
                }
              >
                {active && (
                  <motion.span
                    aria-hidden
                    layoutId="project-filter-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 shadow-[0_0_20px_-4px_rgba(168,85,247,0.9)]"
                  />
                )}
                <span className="relative whitespace-nowrap">{cat}</span>
              </button>
            );
          })}
        </div>
      </PageHeader>

      {cseProjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="mb-16 sm:mb-20"
        >
          <SectionTitle title="CSE" accent="Projects" />
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {cseProjects.map((p, i) => (
              <ProjectCard key={p.title} project={p} index={i} onClick={() => setSelected(p)} />
            ))}
          </div>
        </motion.div>
      )}

      {eeeProjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
        >
          <SectionTitle title="EEE" accent="Projects" />
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {eeeProjects.map((p, i) => (
              <ProjectCard key={p.title} project={p} index={i} onClick={() => setSelected(p)} />
            ))}
          </div>
        </motion.div>
      )}

      {filteredProjects.length === 0 && (
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="py-16 text-center text-gray-500"
        >
          No projects found for this category.
        </motion.p>
      )}

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
