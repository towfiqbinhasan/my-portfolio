"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function PageLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] bg-[#0a0a0f] flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative flex flex-col items-center gap-4"
          >
            <div className="relative">
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
    className="absolute -inset-4 rounded-full border-[3px] border-transparent border-t-purple-500 border-r-pink-500"
  />
  <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden shadow-2xl shadow-purple-500/50">
    <Image
      src="/logo.png"
      alt="Loading"
      fill
      className="object-cover"
      priority
    />
  </div>
</div>
            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-sm text-gray-400 tracking-wide"
            >
              
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}