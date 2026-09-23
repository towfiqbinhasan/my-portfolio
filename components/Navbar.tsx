"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import Image from "next/image";
import {
  FiMenu,
  FiX,
  FiChevronDown,
  FiCpu,
  FiCamera,
  FiMap,
  FiFilm,
  FiUsers,
} from "react-icons/fi";

const primaryLinks = [
  { name: "Home", path: "/" },
  { name: "Qualification", path: "/qualification" },
  { name: "Experience", path: "/experience" },
  { name: "Skills", path: "/skills" },
  { name: "Projects", path: "/projects" },
  { name: "Research", path: "/research" },
  { name: "Certificate", path: "/certificate"},
  { name: "CV", path: "/cv" },
  { name: "Contact", path: "/contact" },
];

const moreLinks = [
  
  { name: "Gadgets", path: "/gadgets", icon: FiCpu },
  { name: "Tour", path: "/tour", icon: FiMap },
  { name: "Photography", path: "/photography", icon: FiCamera },
  { name: "Filmography", path: "/filmography", icon: FiFilm },
  { name: "Activity", path: "/activity", icon: FiUsers },
];

const allLinks = [
  { name: "Home", path: "/" },
  { name: "Qualification", path: "/qualification" },
   { name: "Experience", path: "/experience" },
  { name: "Skills", path: "/skills" },
  { name: "Projects", path: "/projects" },
  { name: "Research", path: "/research" },
  { name: "Certificate", path: "/certificate" },
  { name: "CV", path: "/cv" },
  { name: "Gadgets", path: "/gadgets" },
    { name: "Tour", path: "/tour" },
  { name: "Photography", path: "/photography" },
  { name: "Filmography", path: "/filmography" },
  { name: "Activity", path: "/activity" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isMoreActive = moreLinks.some((l) => l.path === pathname);

  // Shrink + darken the bar once the page is scrolled, and drive the progress line.
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <motion.nav
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={
        scrolled
          ? "fixed top-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/40 transition-colors duration-500"
          : "fixed top-0 w-full z-50 bg-black/30 backdrop-blur-xl border-b border-white/5 transition-colors duration-500"
      }
    >
      <div
        className={
          scrolled
            ? "max-w-7xl mx-auto flex items-center gap-3 px-4 sm:px-6 py-2.5 transition-[padding] duration-500"
            : "max-w-7xl mx-auto flex items-center gap-3 px-4 sm:px-6 py-4 transition-[padding] duration-500"
        }
      >
        <Link
  href="/"
  onClick={(e) => {
    setOpen(false);
    setMoreOpen(false);
    // Already home: reload so the page starts at the top with the hero intro again.
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "auto" });
      window.location.reload();
    }
  }}
  className="flex items-center gap-2 group flex-shrink-0 whitespace-nowrap"
>
  <div className="relative w-9 h-9 rounded-full overflow-hidden shadow-lg shadow-purple-500/30 ring-2 ring-transparent group-hover:ring-purple-400/60 group-hover:scale-110 group-hover:rotate-[360deg] transition-all duration-700 flex-shrink-0">
    <Image
      src="/logo.png"
      alt="Towfiq Bin Hasan Logo"
      fill
      sizes="36px"
      className="object-cover"
    />
  </div>
  <span className="text-base lg:text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hidden sm:inline-block whitespace-nowrap">
    Towfiq Bin Hasan
  </span>
</Link>

        <div
          className="hidden md:flex items-center gap-1 text-sm ml-auto relative"
          onMouseLeave={() => setHovered(null)}
        >
          {primaryLinks.map((link, i) => {
            const isActive = pathname === link.path;
            return (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.25 + i * 0.05, ease: "easeOut" }}
              >
                <Link
                  href={link.path}
                  onMouseEnter={() => setHovered(link.path)}
                  className={
                    isActive
                      ? "relative block px-3 lg:px-4 py-2 rounded-full transition whitespace-nowrap text-white"
                      : "relative block px-3 lg:px-4 py-2 rounded-full transition whitespace-nowrap text-gray-400 hover:text-white"
                  }
                >
                  {/* Hover highlight glides from link to link */}
                  {hovered === link.path && !isActive && (
                    <motion.div
                      layoutId="hover-pill"
                      className="absolute inset-0 rounded-full bg-white/[0.07]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="nav-active-pill absolute inset-0 rounded-full border border-purple-400/50"
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              </motion.div>
            );
          })}

          <motion.button
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.25 + primaryLinks.length * 0.05, ease: "easeOut" }}
            onMouseEnter={() => setHovered("more")}
            onClick={() => setMoreOpen(!moreOpen)}
            className={
              isMoreActive
                ? "relative flex items-center gap-1 px-3 lg:px-4 py-2 rounded-full transition text-white"
                : "relative flex items-center gap-1 px-3 lg:px-4 py-2 rounded-full transition text-gray-400 hover:text-white"
            }
          >
            {hovered === "more" && !isMoreActive && (
              <motion.div
                layoutId="hover-pill"
                className="absolute inset-0 rounded-full bg-white/[0.07]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {isMoreActive && (
              <motion.div
                layoutId="active-pill"
                className="nav-active-pill absolute inset-0 rounded-full border border-purple-400/50"
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
              />
            )}
            <span className="relative z-10">More</span>
            <FiChevronDown
              className={
                moreOpen
                  ? "relative z-10 transition-transform rotate-180"
                  : "relative z-10 transition-transform"
              }
            />
          </motion.button>

          <AnimatePresence>
            {moreOpen && (
              <>
                <div
                  onClick={() => setMoreOpen(false)}
                  className="fixed inset-0 z-40"
                />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute top-full right-0 mt-3 w-[340px] bg-[#111117]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50"
                >
                  <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />

                  <div className="p-3">
                    <p className="text-[11px] uppercase tracking-wider text-gray-500 px-3 pt-2 pb-3">
                      Explore More
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {moreLinks.map((link) => {
                        const isActive = pathname === link.path;
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.name}
                            href={link.path}
                            onClick={() => setMoreOpen(false)}
                            className={
                              isActive
                                ? "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition bg-gradient-to-r from-purple-500/25 to-pink-500/25 border border-purple-400/40 text-white"
                                : "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                            }
                          >
                            <span
                              className={
                                isActive
                                  ? "w-7 h-7 rounded-lg bg-purple-500/30 flex items-center justify-center flex-shrink-0"
                                  : "w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0"
                              }
                            >
                              <Icon className="text-sm" />
                            </span>
                            <span className="truncate">{link.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <button
          className="md:hidden ml-auto relative w-10 h-10 flex items-center justify-center text-2xl rounded-full hover:bg-white/10 transition flex-shrink-0"
          onClick={() => setOpen(!open)}
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FiX />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FiMenu />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-white/10 max-h-[70vh] overflow-y-auto"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {allLinks.map((link, i) => {
                const isActive = pathname === link.path;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                  >
                    <Link
                      href={link.path}
                      onClick={() => setOpen(false)}
                      className={
                        isActive
                          ? "block px-4 py-3 rounded-xl transition bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/40 text-white"
                          : "block px-4 py-3 rounded-xl transition text-gray-400 hover:bg-white/5 hover:text-white"
                      }
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll progress */}
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400"
      />
    </motion.nav>
  );
}