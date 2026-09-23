"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiExternalLink,
  FiVideo,
  FiGlobe,
  FiDatabase,
} from "react-icons/fi";
import {
  SiPython,
  SiCplusplus,
  SiOpenjdk,
  SiReact,
  SiGooglecolab,
  SiPycharm,
  SiNotepadplusplus,
  SiRstudioide,
  SiGithub,
  SiAutocad,
  SiOverleaf,
  SiCodeblocks,
} from "react-icons/si";
import {
  TbBrandCSharp,
  TbBrandVisualStudio,
  TbBrandVscode,
  TbBrandAdobe,
  TbBrandAdobePremiere,
  TbBrandOffice,
} from "react-icons/tb";
import type { IconType } from "react-icons";
import { PageBackdrop, PageHeader, GlowCard, ease } from "@/components/PageShell";
import { lightboxItem } from "@/components/Carousel";

type Section = { heading: string; text: string };

type Skill = {
  title: string;
  tagline: string;
  icon: IconType;
  iconBg: string;
  category: "Language" | "Tool";
  tags: string[];
  link: string;
  sections: Section[];
};

const languages: Skill[] = [
  {
    title: "Full-Stack Web Development",
    tagline: "From a Class 12 curiosity about HTML to shipping full MERN-stack projects.",
    icon: SiReact,
    iconBg: "from-cyan-500 to-blue-500",
    category: "Language",
    tags: ["HTML5", "CSS3", "JavaScript (ES6+)", "React.js", "Node.js", "MongoDB", "Tailwind CSS", "Firebase", "Git/GitHub"],
    link: "https://react.dev",
    sections: [
      {
        heading: "💻 From Passion to Profession",
        text: "Every developer has a 'Day One,' and for me, that spark ignited back in Class 12. What started as a simple curiosity about how websites work quickly turned into a deep-seated interest in languages like HTML and CSS. Seeing my first lines of code render in a browser was the moment I knew I wanted to build for the web.",
      },
      {
        heading: "🚀 Leveling Up with Programming Hero",
        text: "Once I started my university journey, I decided to take my skills to the professional level. I joined the Programming Hero platform to master full-stack web development. It wasn't just about watching videos; it was about the grind — learning the core logic, building real-world projects, and consistently pushing my code to GitHub.",
      },
      {
        heading: "🛠 My Tech Stack",
        text: "Through dedicated practice and completing every challenging assignment, I built a solid foundation across Frontend (HTML5, CSS3, JavaScript ES6+, React.js, Tailwind CSS), Backend & Database (Node.js, MongoDB), and Tools & Deployment (Firebase, Git/GitHub).",
      },
      {
        heading: "📂 Building and Growing",
        text: "I believe the best way to learn is by doing. Every project I've worked on — including all my intensive assignments from Programming Hero — is documented and live on my GitHub. From crafting responsive layouts with Tailwind to managing data with MongoDB, each repository represents a milestone in my growth as a developer. This is just the beginning — I'm constantly learning, debugging, and building.",
      },
    ],
  },
  {
    title: "Python",
    tagline: "From simple curiosity in freshman year to the primary tool driving my AI research.",
    icon: SiPython,
    iconBg: "from-yellow-400 to-blue-500",
    category: "Language",
    tags: ["Python", "AI", "Data Science", "Research"],
    link: "https://www.python.org",
    sections: [
      {
        heading: "From Curiosity to Research",
        text: "Since the very beginning of my university days, I've had a natural spark of interest in Python. There was something about its simplicity and power that kept me hooked even before I fully understood its potential.",
      },
      {
        heading: "The Shift to Data Science & AI",
        text: "The real turning point came when I started diving into Artificial Intelligence (AI), Data Science, and Research. As I began working on complex academic projects, I realized that getting the right results required more than just theoretical knowledge — it required strong coding skills to handle data effectively.",
      },
      {
        heading: "Finding the Right Path: Code With Harry",
        text: "To bridge the gap between my interest and the technical demands of my research, I turned to the Code With Harry YouTube channel. Following his Python course was a game-changer — not just for learning syntax, but for understanding logic, applying it practically to process data for my varsity research, and getting the results I needed with precision.",
      },
      {
        heading: "The Result",
        text: "Today, Python is no longer just a language I'm 'interested' in — it is the primary tool I use to drive my research and explore the world of AI. My advice to any student starting out: find a resource that clicks for you, and start building.",
      },
    ],
  },
  {
    title: "R Language",
    tagline: "Stepping out of my Python comfort zone to become a data science powerhouse in R.",
    icon: SiRstudioide,
    iconBg: "from-sky-500 to-indigo-500",
    category: "Language",
    tags: ["R", "ggplot2", "Tidyverse", "Statistical Modeling"],
    link: "https://www.r-project.org",
    sections: [
      {
        heading: "Why R?",
        text: "For a long time, Python was my go-to language. But for my university Data Science course, I decided to step out of my comfort zone and explore its sibling, R — often called the 'little brother' of Python, but actually a powerhouse specifically built for statisticians.",
      },
      {
        heading: "The Learning Curve",
        text: "Transitioning wasn't just about learning new syntax; it was about shifting my mindset. R handles data frames and statistical modeling with a unique elegance. Getting used to the Tidyverse ecosystem was a game-changer for data manipulation, ggplot2 let me create publication-ready visualizations, and R's extensive package library made complex academic analysis far more manageable.",
      },
      {
        heading: "The Final Result",
        text: "I successfully completed my Data Science project using R, with the entire repository now live on my GitHub. It's proof that the tool you use matters less than the insights you derive — R has given me a more holistic view of the data landscape.",
      },
    ],
  },
  {
    title: "C#",
    tagline: "Conquering one of my toughest courses (OOP2) by building a real Pharmacy Management System.",
    icon: TbBrandCSharp,
    iconBg: "from-purple-600 to-violet-500",
    category: "Language",
    tags: ["C#", "OOP", "Windows Forms", "SQL"],
    link: "https://learn.microsoft.com/en-us/dotnet/csharp/",
    sections: [
      {
        heading: "My Toughest Challenge: Mastering OOP2",
        text: "University life is full of challenges, but OOP2 tested my limits the most — it's widely known as one of the hardest courses in our curriculum, diving deep into advanced concepts using C#. I built my foundation through step-by-step YouTube tutorials and AI tools to debug errors and understand complex logic.",
      },
      {
        heading: "Featured Project: Pharmacy Management System",
        text: "To put my skills to the test, I built a full Pharmacy Management System — a complete application handling real-world data, fully integrated with a database to store medicine records, sales, and stock details, allowing efficient inventory management with secure data storage. It's live on my GitHub.",
      },
      {
        heading: "Final Thoughts",
        text: "OOP2 might be hard, but it taught me that with the right resources and a 'never give up' attitude, any language can be mastered.",
      },
    ],
  },
  {
    title: "Java",
    tagline: "From basic YouTube tutorials to building a Movie Ticket Management System.",
    icon: SiOpenjdk,
    iconBg: "from-red-500 to-orange-500",
    category: "Language",
    tags: ["Java", "OOP", "Notepad++"],
    link: "https://openjdk.org",
    sections: [
      {
        heading: "My Learning Journey",
        text: "Before my formal course, I had basic Java knowledge from YouTube. But I realized the best way to truly 'speak' a language is to build something with it.",
      },
      {
        heading: "The Project: Movie Ticket Management System",
        text: "I developed a Movie Ticket Management System to practice what I'd learned — organizing code using classes, objects, and logic to handle real-world tasks like managing movie schedules, booking seats, and calculating ticket prices. It's officially uploaded to my GitHub, where version control has been a game-changer for tracking progress and sharing work.",
      },
    ],
  },
  {
    title: "C++",
    tagline: "How C++ turned my fear of programming into my greatest strength.",
    icon: SiCplusplus,
    iconBg: "from-blue-600 to-indigo-600",
    category: "Language",
    tags: ["C++", "OpenGL/GLUT", "Competitive Programming"],
    link: "https://isocpp.org",
    sections: [
      {
        heading: "How It All Started",
        text: "Many people are afraid to start coding, and I was one of them. Programming felt like a mystery when I first entered varsity life — until I found the Anisul Islam YouTube channel, whose simple teaching style made everything click and dissolved my 'fear of programming.'",
      },
      {
        heading: "What I Built with C++",
        text: "C++ became a powerful tool for bringing my ideas to life — from a Computer Graphics Shipping Placement project, to building my own functional calculator, to solving countless Competitive Programming problems.",
      },
      {
        heading: "Why I Love C++",
        text: "Learning C++ taught me how to implement complex logic from scratch, giving me the confidence that I can build anything with the right foundation. If you're a beginner — don't be afraid, you can turn fear into strength just like I did.",
      },
    ],
  },
];

const tools: Skill[] = [
  {
    title: "Visual Studio Code",
    tagline: "My daily-driver code editor since 2020 — versatile, customizable, and irreplaceable.",
    icon: TbBrandVscode,
    iconBg: "from-blue-500 to-sky-400",
    category: "Tool",
    tags: ["Code Editor"],
    link: "https://code.visualstudio.com",
    sections: [
      {
        heading: "Why I Love It",
        text: "I've been a programmer since 2020, and VS Code is the one tool I cannot live without. It handles small scripts and huge projects with equal ease, supports almost any language from HTML/CSS to Python and JavaScript, and lets me customize everything with extensions. Four years in, I've learned all its shortcuts — it makes my work faster and much more fun.",
      },
    ],
  },
  {
    title: "Code::Blocks",
    tagline: "The IDE where I typed my very first 'Hello World!' and fell in love with C++.",
    icon: SiCodeblocks,
    iconBg: "from-slate-500 to-slate-700",
    category: "Tool",
    tags: ["C++ IDE"],
    link: "https://www.codeblocks.org",
    sections: [
      {
        heading: "The Start of My Varsity Life",
        text: "Every programmer has a 'home base' — for me, that was Code::Blocks. The interface looked intimidating at first, but it soon became the most familiar tool in my daily life.",
      },
      {
        heading: "The 'Hello World!' Moment",
        text: "I still remember the excitement of writing my very first program, clicking 'Build and Run,' and seeing the console pop up with those two words. I felt like a wizard.",
      },
      {
        heading: "Why C++ and Code::Blocks?",
        text: "From basic loops and variables to complex Data Structures and Algorithms, every line of my C++ code lived inside this software. It's where I learned how to think, solve problems, and stay patient when a semicolon was missing.",
      },
    ],
  },
  {
    title: "Google Colab",
    tagline: "My secret weapon for AI research — free GPUs and cloud access from anywhere.",
    icon: SiGooglecolab,
    iconBg: "from-orange-500 to-yellow-500",
    category: "Tool",
    tags: ["Cloud GPU", "Research"],
    link: "https://colab.research.google.com",
    sections: [
      {
        heading: "From Student to Researcher",
        text: "When I first started my university AI course, I was often stuck. Discovering Google Colab changed how I work — I didn't have a powerful computer, but Colab gave me free access to fast GPUs, and I learned it all through YouTube tutorials.",
      },
      {
        heading: "Why I Use It for Research Today",
        text: "Today I write Conference and Journal papers, and for every one of them I use Colab to generate results from complex data and models, visualize data with the charts and graphs needed for publication, and work from anywhere since it's entirely cloud-based.",
      },
    ],
  },
  {
    title: "PyCharm",
    tagline: "The professional IDE that made learning Python feel real from day one.",
    icon: SiPycharm,
    iconBg: "from-green-500 to-emerald-600",
    category: "Tool",
    tags: ["Python IDE"],
    link: "https://www.jetbrains.com/pycharm/",
    sections: [
      {
        heading: "Why PyCharm Was My First Choice",
        text: "When I decided to learn Python, I chose PyCharm as my companion from day one. Its instant error detection helped me learn syntax faster, easy file organization let me track my progress day by day, and the one-click 'Run' button brought my code to life instantly.",
      },
      {
        heading: "Learning by Doing",
        text: "Every day I'd open PyCharm and try something new — from printing 'Hello World' to building my first simple calculator. Using a real-world professional tool made me feel like a real programmer from the very beginning.",
      },
    ],
  },
  {
    title: "Microsoft Visual Studio",
    tagline: "The backbone of my first big C# project — a full Pharmacy Management System.",
    icon: TbBrandVisualStudio,
    iconBg: "from-purple-600 to-violet-500",
    category: "Tool",
    tags: ["C#", "OOP", "Database Integration"],
    link: "https://visualstudio.microsoft.com",
    sections: [
      {
        heading: "Why Visual Studio Was My Best Friend",
        text: "Learning C# through Object-Oriented Programming felt like theory, until Visual Studio bridged the gap between language and system. IntelliSense felt like a teacher suggesting the right code as I typed, database integration made connecting C# code to storage surprisingly simple, and it handled everything from UI design to debugging in one place.",
      },
      {
        heading: "The Result: A Pharmacy Management System",
        text: "By applying OOP concepts like Inheritance and Encapsulation, I built a system that can add and update medicine records, track daily sales, and manage inventory so the pharmacist always knows when stock is low.",
      },
    ],
  },
  {
    title: "Oracle for Database",
    tagline: "Turning simple SQL commands into a full database project, live on GitHub.",
    icon: FiDatabase,
    iconBg: "from-red-600 to-rose-500",
    category: "Tool",
    tags: ["SQL", "Database Design"],
    link: "https://www.oracle.com/database/",
    sections: [
      {
        heading: "Why Oracle?",
        text: "During my university database course, Oracle changed how I look at data. It gave me a deep dive into query generation, data structure and how tables connect, and efficiency in managing large amounts of information without slowing down.",
      },
      {
        heading: "My Project Journey",
        text: "Using what I learned in class, I built a database project from scratch, focusing on clean, efficient queries for data entry, updates, and complex searches. Debugging a broken join was a rite of passage — but the results were worth it. The full schema design and SQL scripts are documented on my GitHub.",
      },
    ],
  },
  {
    title: "AutoCAD",
    tagline: "Discovering that AutoCAD's real power, for me, was designing precise electrical circuits.",
    icon: SiAutocad,
    iconBg: "from-black to-gray-700",
    category: "Tool",
    tags: ["Circuit Design", "CAD"],
    link: "https://www.autodesk.com/products/autocad/overview",
    sections: [
      {
        heading: "How It All Started",
        text: "While many associate AutoCAD with buildings or mechanical parts, I found its true power while working on electrical circuits during a university CAD course.",
      },
      {
        heading: "Designing Circuits",
        text: "Instead of drawing on paper, I began using AutoCAD to create circuit designs — every connection precisely aligned, layers keeping complex diagrams organized, and seeing designs in a professional digital format helped me understand the flow of electricity better.",
      },
      {
        heading: "Looking Back",
        text: "Taking that CAD course was one of the best decisions of my university life — it changed how I approach engineering problems entirely.",
      },
    ],
  },
  {
    title: "Notepad++",
    tagline: "Learning Java's true structure by coding without a heavy IDE.",
    icon: SiNotepadplusplus,
    iconBg: "from-teal-500 to-green-600",
    category: "Tool",
    tags: ["Java"],
    link: "https://notepad-plus-plus.org",
    sections: [
      {
        heading: "Why Notepad++?",
        text: "In my 2nd semester, diving into OOP2 with Java, I started in a lightweight text editor instead of a big IDE. It made me more disciplined with syntax and logic and helped me truly understand the structure of the language.",
      },
      {
        heading: "Projects I've Built",
        text: "During this time I completed a Java Foundation project and a Movie Ticket Management System applying OOP principles for bookings, seat selection, and data management — both uploaded to my GitHub.",
      },
    ],
  },
  {
    title: "RStudio",
    tagline: "The IDE that made statistical analysis and visualization click for my Data Science course.",
    icon: SiRstudioide,
    iconBg: "from-sky-500 to-blue-600",
    category: "Tool",
    tags: ["R", "Data Science"],
    link: "https://posit.co/products/open-source/rstudio/",
    sections: [
      {
        heading: "Why R and RStudio?",
        text: "Diving into Data Science meant learning a specific toolset. R is powerful for statistical analysis, and RStudio — an IDE — helped me manage my code, see plots instantly, and keep my workspace organized.",
      },
      {
        heading: "From Learning to Doing",
        text: "I applied these skills to a real-world Data Science project involving data cleaning of messy datasets, visualization to spot trends, and analysis to draw conclusions from the numbers.",
      },
    ],
  },
  {
    title: "GitHub",
    tagline: "My daily habit since Data Structures — part portfolio, part safety net.",
    icon: SiGithub,
    iconBg: "from-gray-700 to-gray-900",
    category: "Tool",
    tags: ["Version Control", "Portfolio"],
    link: "https://github.com/towfiqbinhasan",
    sections: [
      {
        heading: "How I Use GitHub",
        text: "Ever since taking my Data Structures course, I've made it a point to commit every piece of work — from a simple linked list to a complex algorithm — straight to a repository.",
      },
      {
        heading: "Benefits of Saving My Work",
        text: "Every project I've ever built is saved in one place for anyone to see my progress over time, I never worry about losing code if my laptop crashes, and committing regularly keeps me organized and shows how much I'm learning every day. It's not just storage — it's a gallery of my hard work.",
      },
    ],
  },
  {
    title: "Adobe Tools",
    tagline: "Since 2019, transforming raw clips and plain photos into something beautiful.",
    icon: TbBrandAdobe,
    iconBg: "from-red-600 to-red-800",
    category: "Tool",
    tags: ["Photo Editing", "Video Editing"],
    link: "https://www.adobe.com",
    sections: [
      {
        heading: "How It Started",
        text: "My editing journey began in 2019, right as I started college — fascinated by how a raw clip or plain photo could be transformed into something beautiful.",
      },
      {
        heading: "My Tools of the Trade",
        text: "From the very beginning, Adobe Creative Cloud has been my main toolkit — whether tweaking colors or cutting a video sequence.",
      },
      {
        heading: "Knowledge & Growth",
        text: "I don't claim to be a 'master,' but I have solid working knowledge — I know my way around the tools, understand the workflows, and can bring my ideas to life. Editing is a way to express my creativity.",
      },
    ],
  },
  {
    title: "Microsoft Office Suite",
    tagline: "A lifelong companion — from childhood curiosity to daily professional tool.",
    icon: TbBrandOffice,
    iconBg: "from-red-500 via-green-500 to-blue-500",
    category: "Tool",
    tags: ["Word", "Excel", "PowerPoint"],
    link: "https://www.microsoft.com/microsoft-365",
    sections: [
      {
        heading: "From Basics to Mastery",
        text: "My introduction to MS Office started in childhood, and what began as simple curiosity has grown into a professional bond — Word for bringing ideas to life, Excel for data and complex calculations, and PowerPoint for turning information into visual stories.",
      },
      {
        heading: "Always Learning, Always Using",
        text: "I don't just 'know' MS Office — I live in it daily, constantly practicing and finding new ways to be more efficient. It's the backbone of everything I do.",
      },
    ],
  },
  {
    title: "CapCut",
    tagline: "My go-to for fast, simple travel-short editing with the TH Team.",
    icon: FiVideo,
    iconBg: "from-neutral-700 to-neutral-900",
    category: "Tool",
    tags: ["Video Editing"],
    link: "https://www.capcut.com",
    sections: [
      {
        heading: "Perfect for the TH Team",
        text: "I use CapCut to create all the content for my TH Team, especially our traveling shorts — whether we're on the road or capturing quick moments, I can edit and post in no time.",
      },
      {
        heading: "Why I Recommend It",
        text: "It's super simple even for non-experts, has some of the best transitions and filters for short videos, and lets me finish a high-quality video quickly on phone or PC.",
      },
    ],
  },
  {
    title: "Icecream Video Editor",
    tagline: "Six years running — my simple, reliable go-to since 2020.",
    icon: FiVideo,
    iconBg: "from-blue-400 to-cyan-500",
    category: "Tool",
    tags: ["Video Editing"],
    link: "https://icecreamapps.com/Video-Editor/",
    sections: [
      {
        heading: "Very Simple to Use",
        text: "You don't need to be an expert — just drag videos and photos onto the timeline and start editing. Everything is clear and easy to find.",
      },
      {
        heading: "Great Features for Every Video",
        text: "Trimming and cutting, adding background music, text and titles for captions, and smooth transitions to connect clips beautifully — everything I need in one simple package.",
      },
      {
        heading: "Fast and Reliable",
        text: "Since 2020 it has always worked well without slowing down my PC, letting me finish videos quickly whether for social media or personal projects.",
      },
    ],
  },
  {
    title: "Filmmaking & Adobe Video Editor",
    tagline: "Capturing the soul of every journey for the TH Team's travel content.",
    icon: TbBrandAdobePremiere,
    iconBg: "from-indigo-700 to-purple-700",
    category: "Tool",
    tags: ["Filmmaking", "Travel Content"],
    link: "https://www.adobe.com/products/premiere.html",
    sections: [
      {
        heading: "Our Secret Sauce: Maximum Travel Vibes",
        text: "For the TH Team, traveling isn't just about reaching a destination — it's about capturing the soul of the journey, whether hiking a mountain or exploring a busy city market.",
      },
      {
        heading: "Why We Love Adobe Video Editor",
        text: "It makes our travel cuts look seamless with smooth transitions, handles high-resolution footage without losing detail, and gives full creative control over color grading and sound to tell the story exactly how we felt it.",
      },
      {
        heading: "The TH Team Vision",
        text: "Every video we post is a result of hard work, a passion for travel, and the best editing tools — travel is the story, but editing is the heartbeat.",
      },
    ],
  },
  {
    title: "Overleaf",
    tagline: "My indispensable tool for thesis, journal papers, and conference articles.",
    icon: SiOverleaf,
    iconBg: "from-green-600 to-lime-600",
    category: "Tool",
    tags: ["LaTeX", "Academic Writing"],
    link: "https://www.overleaf.com",
    sections: [
      {
        heading: "Why It's Indispensable",
        text: "Formatting an academic paper can be a nightmare — professional templates handle IEEE and formal report formatting automatically, real-time collaboration means no more emailing 'Version_Final_REALLY_Final,' and being cloud-based means I never lose progress if my laptop crashes.",
      },
      {
        heading: "Beyond Papers",
        text: "I also use it to build my CV and other professional documents — the results are always cleaner and more polished than a standard Word document.",
      },
      {
        heading: "My Experience",
        text: "Over the years I've gained deep knowledge of LaTeX commands and environments — it's moved from being just a tool to a central part of my academic workflow. It has a small learning curve, but the professional results are worth it.",
      },
    ],
  },
];

function SkillCard({ skill, index, onClick }: { skill: Skill; index: number; onClick: () => void }) {
  const Icon = skill.icon;
  return (
    <GlowCard delay={index * 0.08} className="h-full">
      <span
        aria-hidden
        className={`absolute -top-12 -right-12 w-36 h-36 rounded-full bg-gradient-to-br ${skill.iconBg} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500`}
      />
      <span aria-hidden className="carousel-sheen pointer-events-none absolute inset-0" />

      <div className="relative flex h-full flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${skill.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
          >
            <Icon className="text-white text-xl" />
          </div>
          <a
            href={skill.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title={`Visit official ${skill.title} website`}
            className="btn-press group/link w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center border border-white/10 text-gray-400 hover:text-purple-300 hover:border-purple-400 hover:bg-purple-400/10"
          >
            <FiExternalLink className="text-sm transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
          </a>
        </div>

        <h3 className="text-base sm:text-lg font-semibold mb-2 leading-snug text-white">{skill.title}</h3>
        <p className="text-gray-400 text-xs sm:text-sm mb-4 leading-relaxed flex-1">{skill.tagline}</p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {skill.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[11px] px-2 py-1 rounded-full bg-purple-400/10 text-purple-300 border border-purple-400/20"
            >
              {t}
            </span>
          ))}
          {skill.tags.length > 3 && (
            <span className="text-[11px] px-2 py-1 rounded-full bg-white/5 text-gray-500 border border-white/10">
              +{skill.tags.length - 3}
            </span>
          )}
        </div>

        <button
          onClick={onClick}
          className="btn-press mt-auto inline-flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs sm:text-sm font-medium text-purple-300 hover:border-purple-400/60 hover:bg-purple-500/15 hover:text-white"
        >
          Read the story
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </div>
    </GlowCard>
  );
}

function SkillModal({ skill, onClose }: { skill: Skill; onClose: () => void }) {
  const Icon = skill.icon;

  // Escape to close and the page scroll locked while the modal is open.
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
          <div aria-hidden className={`h-1.5 w-full bg-gradient-to-r ${skill.iconBg}`} />

          <div className="relative border-b border-white/10 p-5 sm:p-7 md:p-8">
            <span
              aria-hidden
              className={`pointer-events-none absolute -top-16 -left-10 h-44 w-44 rounded-full bg-gradient-to-br ${skill.iconBg} opacity-20 blur-3xl`}
            />

            <motion.div {...lightboxItem(0)} className="relative flex items-start gap-3 pr-10 sm:gap-4">
              <div
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${skill.iconBg} shadow-lg transition-transform duration-500 hover:scale-105 hover:rotate-3 sm:h-14 sm:w-14`}
              >
                <Icon className="text-xl text-white sm:text-2xl" />
              </div>
              <div className="min-w-0">
                <h3 className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-xl font-semibold leading-snug text-transparent sm:text-2xl md:text-3xl">
                  {skill.title}
                </h3>
                <p className="mt-2 max-w-2xl text-xs leading-relaxed text-gray-400 sm:text-sm">
                  {skill.tagline}
                </p>
              </div>
            </motion.div>

            <motion.div {...lightboxItem(1)} className="relative mt-5 flex flex-wrap items-center gap-2">
              {skill.tags.map((t) => (
                <span
                  key={t}
                  className="btn-press rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1 text-[11px] text-purple-300 hover:border-purple-400/50 hover:bg-purple-500/20 hover:text-white sm:text-xs"
                >
                  {t}
                </span>
              ))}
            </motion.div>

            <motion.div {...lightboxItem(2)} className="relative mt-6 border-t border-white/5 pt-6">
              <a
                href={skill.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-press btn-shine group/link inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 px-4 py-2.5 text-xs font-medium text-white shadow-[0_0_20px_-6px_rgba(168,85,247,0.9)] hover:opacity-90 sm:px-5 sm:text-sm"
              >
                <FiExternalLink className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />{" "}
                Visit Official Site
              </a>
            </motion.div>
          </div>

          <div className="p-5 sm:p-7 md:p-8">
            <div className="max-w-3xl space-y-7 sm:space-y-8">
              {skill.sections.map((s, i) => (
                <motion.div key={i} {...lightboxItem(3 + i)} className="relative pl-4 sm:pl-5">
                  <span
                    aria-hidden
                    className="absolute left-0 top-[0.35rem] h-5 w-1 rounded-full bg-gradient-to-b from-purple-400 to-cyan-400 shadow-[0_0_10px_-2px_rgba(168,85,247,0.9)]"
                  />
                  <h4 className="text-sm font-semibold leading-snug text-purple-200 sm:text-[0.95rem]">
                    {s.heading}
                  </h4>
                  <p className="mt-2.5 text-sm leading-[1.8] text-gray-300 md:text-[0.95rem]">
                    {s.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SkillsPage() {
  const [selected, setSelected] = useState<Skill | null>(null);

  return (
    <section className="relative py-12 sm:py-16 px-4 sm:px-6 max-w-6xl mx-auto">
      <PageBackdrop />

      <PageHeader
        eyebrow="Toolbox"
        title="My"
        accent="Skills"
        description={
          <p>
            I am a computer science engineering student majoring in data science, with a deep passion for academic
            research and high-quality technical writing. My primary research interests lie in data science, machine
            learning, and data mining, and I have already gained significant experience by publishing several journal
            and conference papers. Beyond my technical capabilities, I possess strong creative skills in filmmaking,
            video editing, photography, and presentation, and I am a multilingual communicator, fluent in English,
            Bengali, and Hindi.
          </p>
        }
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="btn-press group/chip inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-400/30 bg-purple-400/5 text-purple-300 text-xs font-medium hover:border-purple-400/60 hover:bg-purple-500/15 hover:text-white">
            <FiGlobe className="text-sm transition-transform duration-500 group-hover/chip:rotate-[20deg] group-hover/chip:scale-110" />
            Languages, Tools & Creative Craft
          </span>
          {["English", "Bengali", "Hindi"].map((lang) => (
            <span
              key={lang}
              className="btn-press text-xs sm:text-sm px-4 py-1.5 rounded-full border border-purple-400/30 text-purple-300 bg-purple-400/5 hover:border-purple-400/60 hover:bg-purple-500/15 hover:text-white"
            >
              {lang}
            </span>
          ))}
        </div>
      </PageHeader>

      <div className="mb-14 sm:mb-20">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 flex items-center gap-3"
        >
          <span className="w-2 h-8 bg-gradient-to-b from-purple-500 to-cyan-400 rounded-full" />
          Programming <span className="text-purple-400">Languages</span>
        </motion.h2>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {languages.map((s, i) => (
            <SkillCard key={s.title} skill={s} index={i} onClick={() => setSelected(s)} />
          ))}
        </div>
      </div>

      <div>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 flex items-center gap-3"
        >
          <span className="w-2 h-8 bg-gradient-to-b from-purple-500 to-cyan-400 rounded-full" />
          Tools & <span className="text-purple-400">Software</span>
        </motion.h2>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {tools.map((s, i) => (
            <SkillCard key={s.title} skill={s} index={i} onClick={() => setSelected(s)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && <SkillModal skill={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
