"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiExternalLink, FiCalendar } from "react-icons/fi";

const qualifications = [
  {
    degree: "B.Sc. in Computer Science and Engineering",
    major: "Major in Data Science",
    institute: "American International University-Bangladesh (AIUB)",
    duration: "2022 - Present",
    image: "/institutes/aiub.jpg",
    website: "https://aiub.edu",
  },
  {
    degree: "Higher Secondary Certificate (HSC)",
    major: "Science",
    institute: "Pirganj Govt. College, Thakurgaon, Bangladesh",
    duration: "2019 - 2021",
    image: "/institutes/college.jpg",
    website: "https://www.pirganjgc.edu.bd/",
  },
  {
    degree: "Secondary School Certificate (SSC)",
    major: "Science",
    institute: "Collectorate Public School and College, Thakurgaon, Bangladesh",
    duration: "2017 - 2019",
    image: "/institutes/school.jpg",
    website: "https://www.cpscthakurgaon.edu.bd/",
  },
];

export default function Qualification() {
  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold mb-4 text-center"
      >
        My <span className="text-purple-400">Qualification</span>
      </motion.h1>
      <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">
        I am currently pursuing my Bachelor of Science in Computer Science and Engineering (CSE) at the American International University-Bangladesh (AIUB), where I am developing my technical skills and passion for technology. My academic journey toward engineering began at Pirgonj Government College, Thakurgaon, where I completed my Higher Secondary Certificate (HSC).

Before college, I spent my foundational years at Collectorate Public School and College, Thakurgaon, where I completed my Junior School Certificate (JSC) and Secondary School Certificate (SSC), studying there from Class 8 through Class 10. Earlier in my secondary education, I attended Eco Pathshala in Thakurgaon for Classes 6 and 7.

My primary education was completed at Boro Polashbari Government Primary School in Baliadangi, where I attended classes 3 through 5 and sat for my Primary School Certificate (PSC) examination. My very first steps into schooling began at People's Kindergarten School in Baliadangi, where I studied from nursery up to Class 2. This diverse academic path across various institutions has shaped my dedication and adaptability as a student.


      </p>

      <div className="relative">
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500/20 md:-translate-x-1/2" />

        <div className="space-y-12">
          {qualifications.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={
                i % 2 === 1
                  ? "relative flex flex-col md:flex-row-reverse items-start gap-6"
                  : "relative flex flex-col md:flex-row items-start gap-6"
              }
            >
              <div className="absolute left-6 md:left-1/2 top-8 w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 -translate-x-1/2 ring-4 ring-[#0a0a0f] z-10" />

              <div className="ml-16 md:ml-0 md:w-1/2 w-full">
                <div
                  className={
                    i % 2 === 1
                      ? "bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-400 transition group md:mr-10"
                      : "bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-400 transition group md:ml-10"
                  }
                >
                  <div className="relative w-full h-44 overflow-hidden">
                    <Image
                      src={q.image}
                      alt={q.institute}
                      fill
                      sizes="500px"
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-purple-300 text-xs mb-3">
                      <FiCalendar />
                      <span>{q.duration}</span>
                    </div>

                    <h3 className="text-lg font-semibold mb-2 leading-snug">
                      {q.degree}
                    </h3>
                    <p className="text-purple-400 text-sm mb-1">{q.major}</p>
                    <p className="text-gray-400 text-sm mb-4">{q.institute}</p>

                    {q.website !== "#" ? (
                      
                       <a href={q.website}
                        target="_blank"
                        className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-white/20 hover:bg-purple-500/20 hover:border-purple-400 transition"
                      >
                        Visit Website
                        <FiExternalLink />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="hidden md:block md:w-1/2" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}