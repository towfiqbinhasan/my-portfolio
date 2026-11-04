"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register once; every scroll-driven component imports gsap from here.
gsap.registerPlugin(ScrollTrigger);
// Phones show/hide the address bar while scrolling, which resizes the viewport. Re-measuring
// every pinned section on each of those is what made scrolling stutter on mobile.
ScrollTrigger.config({ ignoreMobileResize: true });

/** Media queries shared by the scroll animations (used with gsap.matchMedia). */
export const MQ = {
  desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
  motion: "(prefers-reduced-motion: no-preference)",
};

export { gsap, ScrollTrigger };
