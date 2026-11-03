"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register once; every scroll-driven component imports gsap from here.
gsap.registerPlugin(ScrollTrigger);

/** Media queries shared by the scroll animations (used with gsap.matchMedia). */
export const MQ = {
  desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
  motion: "(prefers-reduced-motion: no-preference)",
};

export { gsap, ScrollTrigger };
