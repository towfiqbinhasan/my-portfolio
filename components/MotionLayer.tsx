"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Site-wide motion: Lenis inertia scrolling driven by the GSAP ticker (so
 * ScrollTrigger stays in sync), plus a custom dot + trailing ring cursor that
 * grows over links, or shows a word over anything marked data-cursor="View".
 * Both stay off for reduced motion; the cursor also stays off on touch /
 * coarse pointers.
 */
export default function MotionLayer() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

  // Smooth scrolling
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    // Exposed so in-page controls (section rail, overlays) can scroll / pause it.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  // New page: pinned sections must re-measure once the new layout has settled.
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 700);
    return () => clearTimeout(t);
  }, [pathname]);

  // Custom cursor
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!fine.matches || !dot.current || !ring.current) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");

    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const dotX = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ring.current, "x", { duration: 0.55, ease: "power3.out" });
    const ringY = gsap.quickTo(ring.current, "y", { duration: 0.55, ease: "power3.out" });

    let shown = false;
    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const interactive = "a, button, [role='button'], input, textarea, select, label";
    const over = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const word = target?.closest?.<HTMLElement>("[data-cursor]")?.dataset.cursor;
      const hit = !!word || !!target?.closest?.(interactive);
      if (label.current) label.current.textContent = word ?? "";
      ring.current?.classList.toggle("cursor-ring-label", !!word);
      gsap.to(ring.current, { scale: word ? 2.6 : hit ? 1.9 : 1, duration: 0.4, ease: "expo.out" });
      gsap.to(dot.current, { scale: hit ? 0 : 1, duration: 0.4, ease: "expo.out" });
    };
    const leave = () => {
      shown = false;
      gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 });
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    document.addEventListener("pointerleave", leave);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <>
      <div ref={ring} aria-hidden className="cursor-ring">
        <span ref={label} className="cursor-label" />
      </div>
      <div ref={dot} aria-hidden className="cursor-dot" />
    </>
  );
}
