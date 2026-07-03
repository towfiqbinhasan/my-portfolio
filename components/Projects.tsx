"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";
import { FiExternalLink, FiGithub, FiX, FiChevronLeft, FiChevronRight, FiFileText } from "react-icons/fi";
type Project = {
  title: string;
  desc: string;
  details: string;
  tech: string[];
  live: string;
  github: string;
   doc?: { label: string; url: string }[];
  images: string[];
  field: "CSE" | "EEE";
};

const projects: Project[] = [
  {
    title: "SkillSwap — Freelance Micro-Task Platform",
    desc: "A full-stack freelance micro-task marketplace where clients post small jobs and freelancers submit proposals to complete them.",
    details:
      "SkillSwap is a Fiverr-style freelance micro-task marketplace with three role-based dashboards — Client, Freelancer, and Admin. It features Better Auth for Email/Google login, JWT middleware for protected routes, a full Stripe payment system, real-time task search & filtering, and server-side pagination. Clients can post tasks and pay freelancers after accepting proposals, freelancers can browse tasks, submit proposals, and track earnings, while Admins manage users and view transaction history.",
    tech: ["JavaScript", "CSS", "React", "Node.js", "MongoDB", "HTML", "Tailwind"],
    live: "https://skillswap-client-2ngr.vercel.app/",
    github: "https://github.com/towfiqbinhasan/skillswap-client",
    images: [
      "/projects/cse1-1.jpg",
      "/projects/cse1-2.jpg",
      "/projects/cse1-3.jpg",
      "/projects/cse1-4.jpg",
      "/projects/cse1-5.jpg",
      "/projects/cse1-6.jpg",
      "/projects/cse1-7.jpg",
      "/projects/cse1-8.jpg",
      "/projects/cse1-9.jpg",
      "/projects/cse1-10.jpg",
      "/projects/cse1-11.jpg",
      "/projects/cse1-12.jpg",
      "/projects/cse1-13.jpg",
      "/projects/cse1-14.jpg",
      "/projects/cse1-15.jpg",
      "/projects/cse1-16.jpg",
      "/projects/cse1-17.jpg",
      "/projects/cse1-18.jpg",
    ],
    field: "CSE",
  },
  {
    title: "PetAdopt — Pet Adoption Platform",
    desc: "A full-stack MERN pet adoption platform where users can browse, list, and adopt pets securely.",
    details:
      "PetAdopt is a full-stack MERN application that connects pet owners with people looking to adopt. Users can browse all available pets with search-by-name and filter-by-species options, and submit adoption requests once logged in. Pet owners can add, edit, and delete their listings, and approve or reject incoming adoption requests from a dashboard with live statistics. Authentication is handled with JWT stored in secure HTTPOnly cookies, supporting both Google and Email/Password login via Firebase.",
    tech: ["JavaScript", "CSS", "React", "Node.js", "MongoDB", "HTML", "Tailwind"],
    live: "https://pet-adoption-client-one.vercel.app/",
    github: "https://github.com/towfiqbinhasan/pet-adoption-client",
    images: [
      "/projects/cse2-1.jpg",
      "/projects/cse2-2.jpg",
      "/projects/cse2-3.jpg",
      "/projects/cse2-4.jpg",
      "/projects/cse2-5.jpg",
      "/projects/cse2-6.jpg",
      "/projects/cse2-7.jpg",
      "/projects/cse2-8.jpg",
      "/projects/cse2-9.jpg",
      "/projects/cse2-10.jpg",
      "/projects/cse2-11.jpg",
      "/projects/cse2-12.jpg",
      "/projects/cse2-13.jpg",
      "/projects/cse2-14.jpg",
      "/projects/cse2-15.jpg",
      "/projects/cse2-16.jpg",
      "/projects/cse2-17.jpg",
      "/projects/cse2-18.jpg",
      "/projects/cse2-19.jpg",
      "/projects/cse2-20.jpg",
    ],
    field: "CSE",
  },
  {
    title: "Pet Care Management System",
    desc: "A role-based web platform for veterinary clinics and adoption centers to manage pets, appointments, and adoptions.",
    details:
      "PetCare Management System is a web-based platform built for veterinary clinics and adoption centers, with three role-based dashboards — Admin, Veterinarian, and Pet Owner. Admins manage users and oversee appointments and adoption listings. Pet owners can add, edit, and delete pet information, browse pets for adoption, book vet appointments, and communicate with vets. Veterinarians can view and manage appointments, track pet health records, and coordinate with pet owners. Built as a team project of 3 members for the Web Technology course.",
    tech: ["HTML", "CSS", "PHP", "JavaScript", "MySQL"],
    live: "#",
    github:
      "https://github.com/towfiqbinhasan/summer-wbt-2025/tree/main/Petcare-Management-main/Petcare-Management-main",
    images: [
      "/projects/cse3-1.jpg",
      "/projects/cse3-2.jpg",
      "/projects/cse3-3.jpg",
      "/projects/cse3-4.jpg",
      "/projects/cse3-5.jpg",
      "/projects/cse3-6.jpg",
      "/projects/cse3-7.jpg",
      "/projects/cse3-8.jpg",
      "/projects/cse3-9.jpg",
    ],
    field: "CSE",
  },
{
    title: "Movie Ticket Management System",
    desc: "A Java-based desktop application for browsing movies, booking tickets, and simulating online payments.",
    details:
      "Movie Ticket Management System is a Java project built entirely in Notepad++ during my 2nd semester. It features user authentication with login and registration (name, email, age, password), a dashboard displaying all currently available movies, and a booking flow where users select a movie and showtime. To simulate a real-world experience, I added a payment section supporting Card and bKash. Building this without a heavy IDE helped me understand data flow from registration to dashboard and sharpened my attention to syntax. Future plans include adding a database for persistent storage and a more advanced GUI.",
    tech: ["JAVA","with using notepad++"],
    live: "#",
    github:
      "https://github.com/towfiqbinhasan/Java-Project-",
    images: [
      "/projects/cse4-1.jpg",
      "/projects/cse4-2.jpg",
      "/projects/cse4-3.jpg",
      "/projects/cse4-4.jpg",
      "/projects/cse4-5.jpg",
      "/projects/cse4-6.jpg",
      "/projects/cse4-7.jpg",
      "/projects/cse4-8.jpg",
    ],
    field: "CSE",
  },
{
    title: "A Journey from Saint Martin to Singapore",
    desc: "A multi-scene 2D OpenGL animation depicting a ship's journey, with dynamic weather, day-night cycles, and interactive controls.",
    details:
      "A Journey from Saint Martin to Singapore is a 7th-semester Computer Graphics team project featuring 5 interactive scenes built entirely with OpenGL primitives — from cargo ships and bridges to windmills, palm trees, and a sea-side resort. Users control the world in real time: pressing 'R' triggers a particle-based rain system with sound effects, clouds drift and windmill blades rotate using glutTimerFunc, and number keys 1-5 switch between scenes. Mouse clicks start the ship's engine or change the time of day, while integrated Windows Multimedia sounds bring waves, ship horns, and a helicopter to life. Built in C++ with OpenGL/GLUT in Code::Blocks, applying transformations, gluOrtho2D coordinate systems, and color buffering.",
    tech: ["C++","with using codeblocks"," OpenGL/GLUT"],
    live: "#",
    github:
      "https://github.com/towfiqbinhasan/Computer-graphics-in-C-",
    images: [
      "/projects/cse5-1.jpg",
      "/projects/cse5-2.jpg",
      "/projects/cse5-3.jpg",
      "/projects/cse5-4.jpg",
      "/projects/cse5-5.jpg",
    ],
    field: "CSE",
  },
{
    title: "Data Analysis Project: (Diamonds, Bank Marketing, and Dengue Prediction) with R language ",
    desc: "A data science project applying Clustering, Classification, and Regression techniques on three real-world datasets using R.",
    details:
      "This R-based data science project explores three major machine learning techniques across three datasets. First, K-Means Clustering groups diamonds by carat, price, depth, and table, using the Elbow and Silhouette methods to determine the optimal number of clusters. Second, a Decision Tree model predicts whether a customer will subscribe to a bank term deposit, with data cleaned via log transformation and unknown-value handling — revealing call duration and balance as the strongest predictors. Third, Logistic Regression estimates Dengue risk as a probability score based on blood parameters like Hemoglobin, RBC, and Platelet count, including a custom 'Low Platelet Flag' feature, with model accuracy validated using RMSE and R-Squared.",
    tech: ["R-lanuage","R-Squared","RMSE"],
    live: "#",
    github:
      "https://github.com/towfiqbinhasan/Data-Analysis-Project-Diamonds-Bank-Marketing-and-Dengue-Prediction-Data-Science-Project-",
    images: [
      "/projects/cse6-1.jpg",
      
    ],
    field: "CSE",
  },
{
    title: "Railway Anti-Collision System (Bangladesh)",
    desc: "An AI and GPS-driven software engineering project designed to prevent train collisions and track tampering in Bangladesh Railways.",
    details:
      "Railway Anti-Collision System is a Software Engineering project addressing Bangladesh Railway's reliance on manual, oral communication — a major cause of track congestion, collisions, and derailments from tampered fish plates. The proposed system uses AI and GPS tracking to trigger automatic braking when two trains approach the same track, gives dispatchers real-time GPS visibility of every train, uses power relays to detect fish plate tampering and alert the control room, and lets station masters and engineers check gate crossings and track status from mobile or desktop apps. The project focuses on requirement analysis, risk assessment, and system design to replace manual switches with AI-supported infrastructure for safer rail travel.",
    tech: ["Software Engineering", "AI", "GPS Tracking", "System Design"],
    live: "#",
    github:
      "https://github.com/towfiqbinhasan/Software-Engineering-Project",
 doc: [{ label: "Report", url: "/docs/cse7-1.pdf" }],
      images: [
      "/projects/cse7-1.gif",
      
    ],
    field: "CSE",
  },
  {
    title: "Pharmacy Management System",
    desc: "C# Windows Forms desktop application automating pharmacy inventory, employee, and customer operations.",
    details:
      "Pharmacy Management System is a 6th-semester Object-Oriented Programming 2 team project built as a Windows Forms desktop application with SQL database integration. It features three role-based actors: Admins approve new users, manage salaries, and handle leave requests via a live dashboard; Employees manage inventory by adding, updating, or deleting products and track monthly bonuses; Customers browse categories, add medicine to a cart, pay via bKash or MasterCard, and print a PDF invoice, with support for requesting out-of-stock items. The system spans 22 forms, designed using Use Case Diagrams and ER-Diagrams to map data flow between all three roles.",
    tech: ["C#", "Windows Forms", "SQL", "OOP"],
    live: "#",
    github:
      "https://github.com/towfiqbinhasan/Pharmacy-Managment-sysment-project-in-C-",
    doc: [{ label: "Report", url: "/docs/cse8-1.pdf" }],
      images: [
      "/projects/cse8-1.jpg",
      "/projects/cse8-2.jpg",
      "/projects/cse8-3.jpg",
      "/projects/cse8-4.jpg",
      "/projects/cse8-5.jpg",
      "/projects/cse8-6.jpg",
      "/projects/cse8-7.jpg",
      "/projects/cse8-8.jpg",
      "/projects/cse8-10.jpg",
      "/projects/cse8-11.jpg",
      "/projects/cse8-12.jpg",
      "/projects/cse8-13.jpg",
      "/projects/cse8-14.jpg",
    ],
    field: "CSE",
  },
  {
    title: "Online Bookstore Management System",
    desc: "A normalized Oracle 10g database system modeling a real-world online bookstore with customers, authors, and orders.",
    details:
      "Online Bookstore Management System is a 4th-semester Introduction to Database team project built with Oracle 10g. The design started with an ER Diagram connecting Customers, Books, Authors, and Orders, followed by normalization through 1NF, 2NF, and 3NF to organize data into 10 clean tables including Books, Customers, Payments, and Address. The implementation covers table creation with SQL, sample data insertion, and a range of queries from simple SELECTs to complex Inner and Outer Joins, plus custom Views like 'Book Order Details' for quick manager access. This project deepened our understanding of how a well-structured database powers real-world business systems.",
    tech: ["Oracle 10g", "SQL", "Database Design", "Normalization"],
    live: "#",
    github:
      "https://github.com/towfiqbinhasan/DataBase-Project-",
    doc: "/docs/cse9-1.pdf",
      images: [
      "/projects/cse9-1.gif",
    
    ],
    field: "CSE",
  },


   {
    title: "Automatic Plant Watering System",
    desc: "An Arduino-based system that monitors soil moisture and automatically waters plants when needed.",
    details:
      "Automatic Plant Watering System is a 4-member EEE team project (Section N, Group 03, supervised by Dr. Shuvra Mondal) that solves the everyday problem of under- or over-watering plants. Built with an Arduino Uno as the controller, a soil moisture sensor connected to pin 6, and a 5V relay module on pin 3 acting as a switch for the water pump, the system continuously monitors soil wetness. When the soil gets too dry, the sensor signals the Arduino, which activates the relay to turn on the pump — watering the plant until enough moisture is detected, then automatically shutting off to conserve water.",
    tech: ["Arduino Uno", "Soil Moisture Sensor", "Relay Module", "C++"],
    live: "#",
    github:
      "https://github.com/towfiqbinhasan/Electronic-Device-Project-EEE-",
    doc: "/docs/eee1-1.pdf",
      images: [
      "/projects/eee1-1.jpg",
       "/projects/eee1-2.jpg",
        "/projects/eee1-3.jpg",
         "/projects/eee1-4.jpg",
          "/projects/eee1-5.jpg",
           "/projects/eee1-6.jpg",
            
    
    ],
    field: "EEE",
  },
 
{
    title: "Adaptive Traffic Control System for Lane Reduction",
    desc: "A low-cost digital logic circuit that sequences traffic lights to safely merge multiple lanes into one during roadwork.",
    details:
      "Adaptive Traffic Control System for Lane Reduction is a Digital Logic Circuit (DLC) EEE project solving traffic bottlenecks caused by lane closures. A 555 timer IC generates a steady clock pulse, while a potentiometer lets operators adjust green-light duration. A 4017 Decade Counter sequences the lights in correct order, and a transistor-diode logic unit ensures only one lane shows green at a time, with LEDs providing clear visual feedback. Built entirely from breadboards, common ICs, and a 9V battery for just 725 Tk (~$6-7 USD), the prototype demonstrates that simple, affordable circuits can effectively manage lane-reduction traffic. Future plans include adding vehicle detection sensors and AI/CCTV integration for adaptive, real-time traffic management.",
    tech: ["555 Timer IC", "4017 Decade Counter", "Digital Logic Circuit", "Transistors"],
    live: "#",
    github:
      "https://github.com/towfiqbinhasan/Adaptive-Traffic-Control-System-for-Lane-Reduction-DLC-Project-EEE-",
   docs: [
    { label: "Proposal", url: "/docs/eee2-1.pdf" },
    { label: "Report", url: "/docs/eee2-2.pdf" },
  ],
      images: [
      "/projects/eee2-1.jpg",
       "/projects/eee2-2.jpg",
        "/projects/eee2-3.jpg",
        
    ],
    field: "EEE",
  },
{
    title: "DisasterX — IoT-Based Robotic Rover with ESP32-CAM",
    desc: "An Arduino-powered rescue rover with live video streaming and a robotic arm, built for search-and-rescue in hazardous zones.",
    details:
      "DisasterX is an IoT-based robotic rover designed to assist in disaster zones where human access is dangerous, such as collapsed buildings or chemical leaks. Powered by an Arduino Uno, it streams real-time video over Wi-Fi via an ESP32-CAM module, features a servo-powered robotic arm to pick up objects or clear debris, and navigates rough terrain with a four-wheel-drive DC motor system, all controlled wirelessly through an RC transmitter. Testing showed up to 2 hours of continuous operation, a 30-40 meter control range, and a fast ~100-120ms response delay. Built for roughly 25,330 Tk (~$215 USD) using accessible components, DisasterX proves affordable robotics can support real emergency response. Future plans include autonomous obstacle avoidance, gas/temperature sensors, and waterproof/dustproof ruggedization.",
    tech: ["Arduino Uno", "ESP32-CAM", "IoT", "Servo Motors", "DC Motors"],
    live: "#",
    github:
      "https://github.com/towfiqbinhasan/An-IoT-Based-Robotic-Rover-with-ESP32-CAM-Micro-processor-project-EEE",
   docs: [
    { label: "Proposal", url: "/docs/eee3-1.pdf" },
    { label: "Report", url: "/docs/eee3-2.pdf" },
  ],
      images: [
      "/projects/eee4-1.jpg",
       "/projects/eee4-2.jpg",
     
        
    ],
    field: "EEE",
  },







{
    title: "Cricket Field with Lighting System",
    desc: "A miniature model cricket field built with a functional LED lighting circuit, applying basic electrical circuit theory.",
    details:
      "Cricket Field with Lighting System is a 5-member Introduction to Electrical Circuit Lab project (supervised by Sadia Yasmin) that brings a miniature sports field to life with working stadium floodlights. The build combines a hardboard base for the field structure with a basic electrical circuit — LEDs acting as floodlights, a 9V battery for power, a switch for on/off control, and connecting wires throughout. Built for just 425 Tk, the project focused on careful budgeting for safe, quality components and correct wiring, translating classroom circuit theory into a hands-on, real-world build.",
    tech: ["Electrical Circuits", "LED", "Basic Wiring"],
    live: "#",
    github:
      "https://github.com/towfiqbinhasan/Constructing-a-Cricket-Field-with-Lighting-System",
    
      images: [
      "/projects/eee3-1.jpg",
       "/projects/eee3-2.jpg",
       
        
    ],
    field: "EEE",
  },







];

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
      className="cursor-pointer bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-400 transition group"
    >
      <div className="relative w-full h-40 rounded-lg mb-4 overflow-hidden bg-gradient-to-br from-purple-600/30 to-pink-600/30">
        {project.images[0] && (
          <Image
            src={project.images[0]}
            alt={project.title}
            fill
            sizes="400px"
            className="object-cover group-hover:scale-105 transition duration-500"
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
        
        <a  href={project.github}
          onClick={(e) => e.stopPropagation()}
          target="_blank"
          className="flex items-center gap-1 text-sm hover:text-purple-400"
        >
          <FiGithub /> Code
        </a>
{project.docs && project.docs.map((d) => (
  
  <a  key={d.url}
    href={d.url}
    onClick={(e) => e.stopPropagation()}
    target="_blank"
    className="flex items-center gap-1 text-sm hover:text-purple-400"
  >
    <FiFileText /> {d.label}
  </a>
))}


      </div>
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
                className="object-cover"
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

          <div className="flex gap-4">
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
            
           <a   href={project.github}
              target="_blank"
              className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/10 transition"
            >
              <FiGithub /> View Code
            </a>
           {project.docs && project.docs.map((d) => (
  
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
  const cseProjects = projects.filter((p) => p.field === "CSE");
  const eeeProjects = projects.filter((p) => p.field === "EEE");

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
      <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">
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

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}