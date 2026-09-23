"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiMail, FiArrowUp, FiArrowUpRight } from "react-icons/fi";
import { FaGithub, FaLinkedin, FaFacebook, FaWhatsapp } from "react-icons/fa";
import type { CSSProperties } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const explore = [
  { name: "Qualification", path: "/qualification" },
  { name: "Experience", path: "/experience" },
  { name: "Skills", path: "/skills" },
  { name: "Projects", path: "/projects" },
  { name: "Research", path: "/research" },
];

const more = [
  { name: "Certificate", path: "/certificate" },
  { name: "CV", path: "/cv" },
  { name: "Gadgets", path: "/gadgets" },
  { name: "Tour", path: "/tour" },
  { name: "Photography", path: "/photography" },
  { name: "Filmography", path: "/filmography" },
  { name: "Activity", path: "/activity" },
];

const socials = [
  { href: "https://github.com/towfiqbinhasan", icon: FaGithub, label: "GitHub", color: "#e6e6e6" },
  { href: "https://www.linkedin.com/in/md-towfiq-bin-hasan-531ba5265/", icon: FaLinkedin, label: "LinkedIn", color: "#0A66C2" },
  { href: "https://www.facebook.com/share/18Zth7mnQQ/", icon: FaFacebook, label: "Facebook", color: "#1877F2" },
  { href: "mailto:towfiqbinhasan@gmail.com", icon: FiMail, label: "Email", color: "#EA4335" },
  { href: "https://wa.me/qr/IHA6ZSEDQZ57M1", icon: FaWhatsapp, label: "WhatsApp", color: "#25D366" },
];

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease },
});

function FooterLink({ href, name }: { href: string; name: string }) {
  return (
    <li>
      <Link
        href={href}
        className="group/link inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors duration-300 hover:text-white"
      >
        <span
          aria-hidden
          className="h-px w-0 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 group-hover/link:w-3"
        />
        {name}
        <FiArrowUpRight className="text-[0.85em] opacity-0 transition-all duration-300 group-hover/link:opacity-100" />
      </Link>
    </li>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-white/[0.02] backdrop-blur-sm">
      {/* Gradient hairline along the top edge, the same accent the rest of the site uses */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent"
      />
      {/* Soft spotlight so the strip reads as part of the page, not a dead band */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-56"
        style={{
          background:
            "radial-gradient(ellipse 55% 100% at 50% 0%, rgba(168,85,247,0.14), transparent 70%)",
        }}
      />
      {/* Faint grid, echoing the hero */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 70% 80% at 50% 0%, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 50% 0%, black, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-14 sm:px-6 sm:pt-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
          {/* Brand */}
          <motion.div {...reveal(0)}>
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <span className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-transparent transition-all duration-700 group-hover:rotate-[360deg] group-hover:ring-purple-400/60">
                <Image src="/logo.png" alt="Towfiq Bin Hasan Logo" fill sizes="40px" className="object-cover" />
              </span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-lg font-bold text-transparent">
                Towfiq Bin Hasan
              </span>
            </Link>

            <a
              href="mailto:towfiqbinhasan@gmail.com"
              className="group/mail mt-5 inline-flex items-center gap-2.5 text-sm text-gray-500 transition-colors duration-300 hover:text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 transition-all duration-300 group-hover/mail:-translate-y-0.5 group-hover/mail:bg-purple-500/15 group-hover/mail:ring-purple-400/40">
                <FiMail />
              </span>
              towfiqbinhasan@gmail.com
            </a>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {socials.map(({ href, icon: Icon, label, color }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  title={label}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  style={{ "--sc": color } as CSSProperties}
                  className="social-orb btn-press flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-lg text-neutral-400"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          <motion.div {...reveal(0.1)}>
            <h3 className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-purple-300/80">
              <span aria-hidden className="h-px w-5 bg-gradient-to-r from-purple-400 to-transparent" />
              Explore
            </h3>
            <ul className="space-y-2.5">
              {explore.map((l) => (
                <FooterLink key={l.path} href={l.path} name={l.name} />
              ))}
            </ul>
          </motion.div>

          <motion.div {...reveal(0.18)}>
            <h3 className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-purple-300/80">
              <span aria-hidden className="h-px w-5 bg-gradient-to-r from-purple-400 to-transparent" />
              More
            </h3>
            <ul className="space-y-2.5">
              {more.map((l) => (
                <FooterLink key={l.path} href={l.path} name={l.name} />
              ))}
            </ul>
          </motion.div>

          {/* Get in touch */}
          <motion.div {...reveal(0.26)} className="sm:col-span-2 lg:col-span-1">
            <h3 className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-purple-300/80">
              <span aria-hidden className="h-px w-5 bg-gradient-to-r from-purple-400 to-transparent" />
              Contact
            </h3>
            <Link
              href="/contact"
              className="btn-press btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_28px_-12px_rgba(168,85,247,0.9)]"
            >
              Contact Me
              <FiArrowUpRight />
            </Link>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          {...reveal(0.3)}
          className="mt-12 flex flex-col items-center gap-4 border-t border-white/10 pt-6 sm:flex-row sm:justify-between"
        >
          <p className="text-center text-sm text-gray-500 sm:text-left">
            © {new Date().getFullYear()} Towfiq Bin Hasan. All rights reserved.
          </p>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="btn-press group/top inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-gray-400 hover:border-purple-400/40 hover:bg-purple-500/10 hover:text-white"
          >
            Back to top
            <FiArrowUp className="transition-transform duration-300 group-hover/top:-translate-y-0.5" />
          </button>
        </motion.div>
      </div>
    </footer>
  );
}
