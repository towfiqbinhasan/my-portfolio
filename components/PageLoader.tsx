"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";

const ease = [0.22, 1, 0.36, 1] as const;

export default function PageLoader() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [prevPath, setPrevPath] = useState(pathname);

  // Route changed: show the loader again (state adjusted during render, per React docs).
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setLoading(true);
  }

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [loading, pathname]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 0.45, ease } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#08080c]"
        >
          {/* Ambient spotlight + grain, matching the hero */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 55% at 50% 45%, rgba(168,85,247,0.18), transparent 70%)",
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.06, opacity: 0, transition: { duration: 0.35, ease } }}
            transition={{ duration: 0.5, ease }}
            className="relative flex flex-col items-center"
          >
            <div className="relative flex h-40 w-40 items-center justify-center">
              {/* Breathing halo */}
              <motion.span
                aria-hidden
                animate={reduce ? undefined : { scale: [1, 1.18, 1], opacity: [0.35, 0.12, 0.35] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute h-32 w-32 rounded-full bg-purple-500/40 blur-2xl"
              />

              {/* Outer ring: slow, thin, dashed */}
              <motion.span
                aria-hidden
                animate={reduce ? undefined : { rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute h-40 w-40 rounded-full border border-dashed border-white/10"
              />

              {/* Conic sweep ring — the main spinner */}
              <motion.span
                aria-hidden
                animate={reduce ? undefined : { rotate: 360 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                className="absolute h-32 w-32 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, rgba(168,85,247,0.15) 140deg, #a855f7 300deg, #ec4899 360deg)",
                  WebkitMask:
                    "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
                  mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
                }}
              />

              {/* Comet head riding the ring */}
              <motion.span
                aria-hidden
                animate={reduce ? undefined : { rotate: 360 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                className="absolute h-32 w-32"
              >
                <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-400 shadow-[0_0_14px_4px_rgba(236,72,153,0.8)]" />
              </motion.span>

              {/* Logo */}
              <motion.div
                animate={reduce ? undefined : { scale: [1, 1.05, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="relative h-24 w-24 overflow-hidden rounded-full ring-1 ring-white/10 shadow-2xl shadow-purple-500/40"
              >
                <Image src="/logo.png" alt="Loading" fill sizes="96px" className="object-cover" priority />
              </motion.div>
            </div>

            {/* Determinate bar that fills over the loader's lifetime */}
            <div className="mt-8 h-px w-40 overflow-hidden rounded-full bg-white/10">
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="block h-full w-full origin-left bg-gradient-to-r from-purple-400 to-pink-400"
              />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease }}
              className="mt-4 text-[11px] uppercase tracking-[0.35em] text-neutral-500"
            >
              Towfiq Bin Hasan
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
