"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const experiences: Experience[] = [
  {
    role: "Software Engineer Intern",
    company: "Tizaraa IT",
    companyLink: "https://tizaraa.com",
   employmentType: "Internship · On-site",
    duration: "02 May 2026 - Present · 3 months",
    location: "Dhaka, Bangladesh",
    mode: "On-site",
    logo: "/experience/tizaara.jpg",
    logoText: "TI",
    logoBg: "from-orange-500 to-amber-500",
    description:
      "Working as a Software Engineer Intern at Tizaraa IT, contributing to real-world software development tasks on-site in Dhaka. Involved in building and maintaining features across the product, collaborating closely with the engineering team, and applying software engineering best practices in a full-time, in-office environment.",
    skills: ["Software Development", "Full-Stack Engineering", "Team Collaboration", "Problem Solving"],
    offerLetter: { label: "Internship Offer Letter", fileKey: "tizaraa-offer.pdf" },
  },
  {
  role: "Web Development Intern",
  company: "Codveda Technologies",
  companyLink: "https://www.codveda.com",
  employmentType: "Internship · Remote",
  duration: "07 july 2026 - Present · 1 month",
  location: "Ashta Road, Manora, Chandrapur, India",
  mode: "Remote",
  logo: "/experience/codveda.jpg",
  logoText: "CV",
  logoBg: "from-blue-500 to-indigo-600",
  description:
    "Selected as a Web Development Intern at Codveda Technologies for exceptional qualifications, strong technical skills, and enthusiasm for web development. The role involves immersing in the dynamic world of web development and digital innovation, participating in projects requiring expertise in web design, development, and implementation, and contributing to creating and enhancing web applications that are functional, user-friendly, and visually appealing.",
  skills: ["Web Development", "HTML/CSS", "JavaScript", "UI/UX Implementation"],
  offerLetter: { label: "Internship Offer Letter", fileKey: "codveda-offer.pdf" },
},
{
  role: "Data Science Intern",
  company: "CodeAlpha",
  companyLink: "https://www.codealpha.tech",
  employmentType: "Internship · Remote",
  duration: "01 May 2026 - 30 May 2026 · 1 month",
  location: "Lucknow, U.P, India",
  mode: "Remote",
  logo: "/experience/code.jpg",
  logoText: "CA",
  logoBg: "from-pink-500 to-rose-600",
  description:
    "Completed a Data Science Internship at CodeAlpha from 1st May 2026 to 30th May 2026, focused on learning new skills with a deeper understanding of concepts through hands-on application of gained knowledge. The internship emphasized orientation, practical skill-building, and fulfilling assigned work responsibly and effectively — equipping for future data science projects.",
  skills: ["Data Science", "Python", "Data Analysis", "Machine Learning"],
  offerLetter: { label: "Internship Offer Letter", fileKey: "codealpha-offer.pdf" },
},
  {
    role: "Back End Developer",
    company: "HexSoftwares",
    companyLink: "https://hexsoftwares.tech",
    employmentType: "Internship · Remote",
    duration: "01 Apr 2026 - 30 Apr 2026· 1 month",
    location: "Ramadevi, Kanpur, UP, India (208007)",
    mode: "Remote",
    logo: "/experience/hex.jpg",
    logoText: "HS",
    logoBg: "from-cyan-500 to-blue-600",
    description:
      "Completed a remote Back End Developer Internship at HexSoftwares, focusing on server-side application logic, API development, and database integration. The internship involved applying core backend concepts under real project constraints, with knowledge assessments and structured project deliverables throughout the program.",
    skills: ["Node.js", "REST APIs", "Databases", "Backend Architecture"],
    offerLetter: { label: "Internship Offer Letter", fileKey: "hexsoftwares-offer.pdf" },
  },
  {
    role: "Full Stack Engineer",
    company: "Syntecxhub",
    companyLink: "https://syntecxhub.com",
    employmentType: "Internship · Remote",
    duration: "01 Apr 2026 - 30 Apr 2026 · 1 month",
    location: "Itanagar, Arunachal Pradesh, India",
    mode: "Remote",
    logo: "/experience/sys.jpg",
    logoText: "S",
    logoBg: "from-blue-500 to-indigo-600",
    description:
      "Serving as a Full Stack Web Developer Intern at Syntecxhub, working remotely on end-to-end web development tasks spanning both frontend and backend. Responsibilities include building functional web features, following professional development workflows, and delivering work aligned with internship program terms and conditions.",
    skills: ["Full-Stack Development", "React", "Node.js", "API Integration"],
    offerLetter: { label: "Internship Offer Letter", fileKey: "syntecxhub-offer.pdf" },
  },
  {
    role: "Full Stack Engineer Intern",
    company: "CodeAlpha",
    companyLink: "https://www.codealpha.tech",
    employmentType:"Internship · Remote",
    duration: "01 Apr 2026 - 30 Apr 2026 · 1 months",
    location: "Itanagar, Arunachal Pradesh, India",
    mode: "Remote",
    logo: "/experience/code.jpg",
    logoText: "CA",
    logoBg: "from-indigo-600 to-blue-700",
    description:
      "Completed a Full Stack Web Developer internship at CodeAlpha, a remote internship program offering hands-on experience with real projects. The role focused on applying full-stack development skills and knowledge gained during the internship to practical assignments, working independently within a structured remote internship framework.",
    skills: ["Full-Stack Development", "JavaScript", "Web Development", "Remote Collaboration"],
    offerLetter: { label: "Internship Offer Letter", fileKey: "codealpha-offerfull.pdf" },
  },
  {
    role: "Private Tutor",
    company: "Caretutors Technologies Ltd.",
    companyLink: "https://caretutors.com",
    employmentType: "Part-time · On-site",
    duration: "Jan 2025 - Present · 1 yr 7 months",
    location: "Dhaka, Bangladesh",
    mode: "",
    logo: "/experience/care.jpg",
    logoText: "CT",
    logoBg: "from-blue-600 to-sky-500",
    description:
      "Working as a Private Tutor through Caretutors Technologies Ltd., providing subject-specific academic guidance to students in Dhaka. The role involves preparing lesson plans, explaining core concepts clearly, and tracking student progress on a consistent, ongoing basis.",
    skills: ["Teaching", "Mentoring", "Curriculum Planning", "Communication"],
  },
  {
    role: "Course Instructor",
    company: "10 Minute School",
    companyLink: "https://10minuteschool.com",
    employmentType: "Part-time · Remote",
    duration: "Jan 2023 - Jan 2024 · 1 yr 1 month",
    location: "Dhaka, Bangladesh",
    mode: "On-site",
    logo: "/experience/10min.jpg",
    logoText: "10",
    logoBg: "from-red-600 to-neutral-900",
    description:
      "Worked as a Course Instructor at 10 Minute School, Bangladesh's leading online learning platform, delivering structured lessons on-site in Dhaka. Responsible for preparing course content, teaching concepts clearly to students, and contributing to the platform's academic quality standards.",
    skills: ["Teaching", "Content Delivery", "Curriculum Development"],
  },
  {
    role: "Assistant of Physics Teacher",
    company: "UDVASH-উদ্ভাস",
    companyLink: "https://udvash.com",
    employmentType: "Part-time · On-site",
    duration: "Jan 2023 - Feb 2024 · 1 yr 2 months",
    location: "Dhaka, Bangladesh",
    mode: "",
    logo: "/experience/ud.jpg",
    logoText: "U",
    logoBg: "from-fuchsia-600 to-purple-700",
    description:
      "Assisted senior faculty as a Physics and Mathematics teacher at UDVASH, one of Bangladesh's premier admission and academic coaching centers. Supported lesson preparation, doubt-clearing sessions, and helped students strengthen their conceptual understanding of Physics and Mathematics.",
    skills: ["Physics Teacher", "Mathematics Teacher", "Academic Support"],
  },
];

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
        className={`relative ${dims} flex-shrink-0 overflow-hidden bg-white/10 border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-300`}
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
      className={`${dims} bg-gradient-to-br ${exp.logoBg} flex items-center justify-center flex-shrink-0 shadow-lg text-white font-bold group-hover:scale-105 transition-transform duration-300`}
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-sm flex items-center justify-center px-4 sm:px-6 py-10 overflow-y-auto"
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
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-purple-500/40 rounded-full transition"
        >
          <FiX />
        </button>

        <div className="flex items-center gap-2 text-purple-300 mb-1">
          <FiLock className="text-sm" />
          <span className="text-xs font-medium">Restricted Document</span>
        </div>
        <h3 className="text-xl font-semibold mb-1">Request Access</h3>
        <p className="text-purple-300 text-sm mb-6">
          {target.company} — {target.label}
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
            <label className="text-sm text-gray-400 mb-1 block">Phone Number</label>
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
              Why do you need to see this offer letter?
            </label>
            <textarea
              name="reason"
              required
              rows={3}
              placeholder="e.g. Verifying internship credentials for a job application"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition rounded-lg px-6 py-3 font-medium disabled:opacity-50"
          >
            {loading ? "Sending..." : (
              <>
                <FiSend /> Submit Request
              </>
            )}
          </button>
        </form>
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
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center px-4 sm:px-6 py-10 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#111117] border border-white/10 rounded-2xl overflow-hidden my-auto max-h-[85vh] flex flex-col"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-purple-500/60 rounded-full text-xl transition"
        >
          <FiX />
        </button>

        <div className={`h-1.5 bg-gradient-to-r ${exp.logoBg} flex-shrink-0`} />

        <div className="p-6 md:p-8 border-b border-white/10 flex-shrink-0">
          <div className="flex items-start gap-4">
            <CompanyLogo exp={exp} size="lg" />
            <div className="min-w-0">
              <h3 className="text-xl md:text-2xl font-semibold mb-1 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {exp.role}
              </h3>
              <a
                href={exp.companyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-purple-300 text-sm hover:text-purple-200 hover:underline underline-offset-2 transition-colors"
              >
                {exp.company} · {exp.employmentType}
                <FiExternalLink className="text-xs" />
              </a>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-gray-500 text-xs">
                <span className="flex items-center gap-1">
                  <FiCalendar /> {exp.duration}
                </span>
                <span className="flex items-center gap-1">
                  <FiMapPin /> {exp.location}
                  {exp.mode ? ` · ${exp.mode}` : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          <p className="text-gray-300 text-sm leading-relaxed">{exp.description}</p>

          <div>
            <h4 className="text-sm font-semibold text-purple-300 mb-2">Skills Gained</h4>
            <div className="flex flex-wrap gap-2">
              {exp.skills.map((s) => (
                <span
                  key={s}
                  className="text-xs px-3 py-1.5 rounded-full bg-purple-400/10 text-purple-300 border border-purple-400/20"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={exp.companyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition"
            >
              <FiExternalLink /> Visit {exp.company}
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
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition"
              >
                <FiLock className="text-xs" /> Request {exp.offerLetter.label}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ExperiencePage() {
  const [selected, setSelected] = useState<Experience | null>(null);
  const [requestTarget, setRequestTarget] = useState<RequestTarget | null>(null);

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-5xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center"
      >
        My <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Experience</span>
      </motion.h1>
      <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
        A timeline of the roles, internships, and teaching positions that have shaped my professional journey from
        full-stack development internships to hands-on software engineering and academic mentoring. Internship offer
        letters are available on request for verification purposes.
      </p>

      <div className="relative">
        <div className="absolute left-4 sm:left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500/20 md:-translate-x-1/2" />

        <div className="space-y-10 sm:space-y-12">
          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className={
                i % 2 === 1
                  ? "relative flex flex-col md:flex-row-reverse items-start gap-4 sm:gap-6"
                  : "relative flex flex-col md:flex-row items-start gap-4 sm:gap-6"
              }
            >
              <div className="absolute left-4 sm:left-6 md:left-1/2 top-6 sm:top-8 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 -translate-x-1/2 ring-4 ring-[#0a0a0f] z-10" />

              <div className="ml-10 sm:ml-16 md:ml-0 md:w-1/2 w-[calc(100%-2.5rem)] sm:w-[calc(100%-4rem)]">
                <div
                  className={
                    i % 2 === 1
                      ? "bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-400/60 transition-colors duration-300 group md:mr-10 p-5 sm:p-6"
                      : "bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-400/60 transition-colors duration-300 group md:ml-10 p-5 sm:p-6"
                  }
                >
                  <div className="flex items-start gap-3 mb-3">
                    <CompanyLogo exp={exp} size="md" />
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold leading-snug">{exp.role}</h3>
                      <a
                        href={exp.companyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-purple-300 text-xs sm:text-sm hover:text-purple-200 hover:underline underline-offset-2 transition-colors"
                      >
                        {exp.company} · {exp.employmentType}
                        <FiExternalLink className="text-[10px]" />
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 text-gray-500 text-xs">
                    <span className="flex items-center gap-1">
                      <FiCalendar className="flex-shrink-0" /> {exp.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiMapPin className="flex-shrink-0" /> {exp.location}
                      {exp.mode ? ` · ${exp.mode}` : ""}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {exp.skills.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="text-[11px] px-2 py-1 rounded-full bg-purple-400/10 text-purple-300 border border-purple-400/20"
                      >
                        {s}
                      </span>
                    ))}
                    {exp.skills.length > 3 && (
                      <span className="text-[11px] px-2 py-1 rounded-full bg-white/5 text-gray-500 border border-white/10">
                        +{exp.skills.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => setSelected(exp)}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-purple-300 hover:text-white transition-colors"
                    >
                      <FiBriefcase className="text-sm" />
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
                        className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-400/25 hover:bg-purple-500/25 transition"
                      >
                        <FiLock className="text-[10px]" /> Request Offer Letter
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="hidden md:block md:w-1/2" />
            </motion.div>
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
