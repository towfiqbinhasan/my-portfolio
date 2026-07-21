"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiX, FiAward, FiCalendar, FiExternalLink, FiZoomIn } from "react-icons/fi";

type Certificate = {
  title: string;
  issuer: string;
  issuerLink: string;
  date: string;
  image: string;
  skills: string[];
  description: string;
};

const certificates: Certificate[] = [
  {
    title: "UX Research Strategy with AI",
    issuer: "Grameenphone Academy",
    issuerLink: "https://www.grameenphone.com",
    date: "2026-02-23",
    image: "/certificate/cert1.jpg",
    skills: ["UX Research", "AI-Assisted Research", "Research Strategy"],
    description:
      "Completed a certification program focused on leveraging AI tools to strengthen UX research strategy, covering research planning, AI-assisted insight generation, and applying findings to product decisions.",
  },
 {
    title: "Design System Thinking with AI",
    issuer: "Grameenphone Academy",
    issuerLink: "https://www.grameenphone.com",
    date: "2026-03-03",
    image: "/certificate/cert2.jpg",
    skills: ["Design Systems", "AI-Assisted Design", "Systems Thinking"],
    description:
      "Completed a certification program on applying design system thinking with AI, covering how to build scalable, consistent design systems and use AI tools to accelerate design decisions.",
},
 {
    title: "UX Design Decision-making with AI",
    issuer: "Grameenphone Academy",
    issuerLink: "https://www.grameenphone.com",
    date: "2026-03-11",
    image: "/certificate/cert3.jpg",
    skills: ["UX Design", "AI-Assisted Decision-making", "Design Judgment"],
    description:
      "Completed a certification program on making informed UX design decisions with the help of AI, covering how to evaluate design choices, weigh trade-offs, and use AI tools to support the decision-making process.",
},
{
    title: "Certificate of Presentation — National Biomed Health ResearchCon (NBHRC) 2025",
    issuer: "Dhaka Medical College Research & Academic Club (DMC-RAC)",
    issuerLink: "https://www.dmcrac.org/nbhrc25/",
    date: "2025-08-29",
    image: "/certificate/cert4.jpg",
    skills: ["Research Presentation", "Biomedical Research", "Academic Communication"],
    description:
      "Successfully presented research work at the National Biomed Health ResearchCon (NBHRC) 2025, held on 28–29 August 2025, organized by Dhaka Medical College Research & Academic Club (DMC-RAC) in collaboration with the Bangladesh Society of Medicine.",
},
{
    title: "Network Smarter with AI",
    issuer: "Grameenphone Academy",
    issuerLink: "https://www.grameenphone.com",
    date: "2026-04-28",
    image: "/certificate/cert5.jpg",
    skills: ["Network Optimization", "AI in Telecom", "Smart Decision-making"],
    description:
      "Completed a certification program on applying AI to build smarter, more efficient telecom networks, covering AI-driven network optimization and intelligent decision-making in network operations.",
},
{
    title: "AI-Integrated UX Strategist",
    issuer: "Grameenphone Academy",
    issuerLink: "https://www.grameenphone.com",
    date: "2026-03-26",
    image: "/certificate/cert6.jpg",
    skills: ["UX Strategy", "AI Integration", "UI/UX Design"],
    description:
      "Awarded in recognition of outstanding dedication for completing the AI-Integrated UX Strategist program, covering how to integrate AI into UX strategy, UI/UX design, and overall product decision-making.",
},
{
    title: "AI-Powered Communication",
    issuer: "Grameenphone Academy",
    issuerLink: "https://www.grameenphone.com",
    date: "2026-05-03",
    image: "/certificate/cert7.jpg",
    skills: ["AI-Powered Communication", "Effective Messaging", "AI Tools"],
    description:
      "Completed a certification program on using AI to enhance communication, covering how to craft clear, effective messages and apply AI tools to improve everyday communication practices.",
},
{
  title: "Build ATS-Winning CV",
  issuer: "Grameenphone Academy",
  issuerLink: "https://www.grameenphone.com",
  date: "2026-07-20",
  image: "/certificate/cert12.jpg",
  skills: ["Resume Writing", "ATS Optimization", "Career Development"],
  description:
    "Completed a certification program on building an ATS-winning CV, covering how to structure and optimize a resume to pass Applicant Tracking Systems while remaining compelling to human recruiters — an essential skill for effective job applications.",
},
{
    title: "A Machine Learning Approach for Quantifying Sea-Level Rise: A Conservative Baseline Forecast through 2030 using Prophet Architecture",
    issuer: "IEEE Photonics Society Bangladesh Chapter",
    issuerLink: "https://qpain.org/",
    date: "2026-04-18",
    image: "/certificate/cert8.jpg",
    skills: ["Machine Learning", "Research Paper Presentation", "Time-Series Forecasting"],
    description:
      "Successfully presented a research paper at the 2026 IEEE 2nd International Conference on Quantum Photonics, Artificial Intelligence and Networking (QPAIN 2026), held on 16–18 April 2026 at CUET, Chattogram, organized by IEEE Photonics Society Bangladesh Chapter.",
},
{
    title: "Analysis of Soil Salinity and Earth Metal Concentrations along River Distance Gradients in the Sundarbans",
    issuer: "Department of Mathematics, University of Chittagong",
    issuerLink: "https://cu.ac.bd",
    date: "2025-12-19",
    image: "/certificate/cert9.jpg",
    skills: ["Research Presentation", "Environmental Data Analysis", "Mathematics"],
    description:
      "Presented a research paper at the 24th International Mathematics Conference (24IMC 2025), themed 'Mathematics: Bridging Theory and Application', held on 18–19 December 2025, organized by the Department of Mathematics, University of Chittagong, and supported by the Bangladesh Mathematical Society.",
},
{
    title: "Comparative Analysis of Classification Techniques in Data Mining: K-Nearest Neighbors, Naive Bayes and Decision Tree-based Approach",
    issuer: "Department of Mathematics, University of Chittagong",
    issuerLink: "https://cu.ac.bd",
    date: "2025-12-19",
    image: "/certificate/cert10.jpg",
    skills: ["Data Mining", "Classification Algorithms", "Research Presentation"],
    description:
      "Co-authored and presented a research paper at the 24th International Mathematics Conference (24IMC 2025), themed 'Mathematics: Bridging Theory and Application', held on 18–19 December 2025, organized by the Department of Mathematics, University of Chittagong, and supported by the Bangladesh Mathematical Society.",
},
{
    title: "Robotics Camp 2022 — Easier Stage",
    issuer: "Roboment R&D Lab",
    issuerLink: "https://www.facebook.com/groups/robotcamp/about",
    date: "2022-12-14",
    image: "/certificate/cert11.jpg",
    skills: ["Digital Electronics", "Automation", "DC Motor Controlling", "Sensor Applications", "Arduino Programming"],
    description:
      "Successfully completed the 'Easier Stage' of Robotics Camp 2022, a one-month online program by Roboment R&D Lab, Gazipur, covering basic digital electronics, automation, DC motor controlling, sensor applications, wireless communication, remote control, security systems, and Arduino programming.",
},
];

export default function CertificatePage() {
  const [selected, setSelected] = useState<Certificate | null>(null);

  // Lock background scroll while the modal is open
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  // Close modal on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <section className="py-16 px-6 max-w-6xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold mb-4 text-center"
      >
        My <span className="text-purple-400">Certificates</span>
      </motion.h1>
      <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">
        A collection of certifications earned through courses, workshops, and
        professional programs.
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {certificates.map((cert, i) => (
          <motion.div
            key={cert.title + i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-400/70 hover:shadow-[0_0_25px_-5px_rgba(168,85,247,0.35)] transition-all duration-300 group"
          >
            {/* Image — click to view full size */}
            <button
              type="button"
              onClick={() => setSelected(cert)}
              className="relative w-full h-52 overflow-hidden bg-black/40 cursor-zoom-in"
            >
              <Image
                src={cert.image}
                alt={cert.title}
                fill
                sizes="400px"
                className="object-contain p-3 transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 text-sm font-medium text-white bg-purple-500/80 px-3 py-1.5 rounded-full">
                  <FiZoomIn /> View full size
                </span>
              </div>
            </button>

            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-base font-semibold mb-1 leading-snug">
                {cert.title}
              </h3>

              <a
                href={cert.issuerLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-purple-300 text-xs mb-1 w-fit hover:text-purple-200 hover:underline underline-offset-2 transition-colors"
              >
                {cert.issuer}
                <FiExternalLink className="text-[11px]" />
              </a>

              <p className="text-gray-500 text-xs flex items-center gap-1 mb-2">
                <FiCalendar /> {cert.date}
              </p>

              <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">
                {cert.description}
              </p>

              {cert.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-white/10">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[11px] leading-none px-2 py-1 rounded-full bg-purple-400/10 text-purple-300 border border-purple-400/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center px-4 py-10 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-[#111117] border border-white/10 rounded-2xl overflow-hidden my-auto"
            >
              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-purple-500/60 rounded-full text-xl transition"
              >
                <FiX />
              </button>

              {/* Full-size image — never cropped, scales to fit */}
              <div className="relative w-full bg-black/60 flex items-center justify-center">
                <Image
                  src={selected.image}
                  alt={selected.title}
                  width={1600}
                  height={1131}
                  sizes="(max-width: 768px) 100vw, 900px"
                  className="w-full h-auto max-h-[75vh] object-contain"
                />
              </div>

              <div className="p-6 md:p-8">
                <div className="flex items-start gap-3">
                  <FiAward className="text-purple-400 text-2xl mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-1">
                      {selected.title}
                    </h3>
                    <a
                      href={selected.issuerLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-purple-300 text-sm hover:text-purple-200 hover:underline underline-offset-2 transition-colors"
                    >
                      {selected.issuer}
                      <FiExternalLink className="text-xs" />
                    </a>
                    <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                      <FiCalendar /> {selected.date}
                    </p>
                  </div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mt-4">
                  {selected.description}
                </p>

                {selected.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-white/10">
                    {selected.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-3 py-1.5 rounded-full bg-purple-400/10 text-purple-300 border border-purple-400/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
