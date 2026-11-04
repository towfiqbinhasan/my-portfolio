"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const TRAIL = 8; // comet dots behind the cursor

/**
 * Site-wide motion: Lenis inertia scrolling driven by the GSAP ticker (so
 * ScrollTrigger stays in sync), plus a custom cursor: a glowing dot, a ring with
 * a turning gradient edge that stretches the way it travels, a comet trail that
 * shows while moving, a soft spotlight, and a ripple on click. Over different
 * kinds of things it takes a different form (see the mode list below).
 * Both stay off for reduced motion; the cursor also stays off on touch /
 * coarse pointers.
 */
export default function MotionLayer() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const shape = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const trailWrap = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Smooth scrolling (wheel only: touch keeps the phone's own native momentum, which is smoother there)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // A slightly lower lerp than the default gives a longer, softer glide after each wheel tick.
    // Lenis takes every wheel event for the page; popups, the chat and the mobile menu
    // scroll on their own, so it steps aside there (and for any other nested scroller).
    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
      allowNestedScroll: true,
      prevent: (node) => node.matches(".modal-scroll, .chat-scroll, [role='dialog'], [aria-modal='true']"),
    });
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
    const d = dot.current, r = ring.current, s = shape.current, tw = trailWrap.current, g = glow.current;
    if (!fine.matches || !d || !r || !s || !tw || !g) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");

    const trail = Array.from(tw.children) as HTMLElement[];
    const parts = [d, r, g, ...trail];
    gsap.set(parts, { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    // Everything is placed from one ticker so the pieces never drift out of step.
    const set = (el: HTMLElement) => ({ x: gsap.quickSetter(el, "x", "px"), y: gsap.quickSetter(el, "y", "px") });
    const dotSet = set(d), ringSet = set(r), glowSet = set(g), trailSet = trail.map(set);
    const shapeSet = gsap.quickSetter(s, "css");
    const mouse = { x: 0, y: 0 };
    const dotP = { x: 0, y: 0 }, ringP = { x: 0, y: 0 }, glowP = { x: 0, y: 0 };
    const trailP = trail.map(() => ({ x: 0, y: 0 }));
    let speed = 0, angle = 0, stretch = 0, trailAlpha = 0;
    const press = { v: 1 }; // squeeze while the button is held, folded into the stretch below
    let shown = false;
    let idle = 0; // seconds the pointer has been still

    // Magnetic buttons: a wrapped button leans a few px towards the pointer (CSS `translate`,
    // so it never fights the button's own transform-based hover/press effects).
    const magnet = { el: null as HTMLElement | null, x: 0, y: 0 };
    const releaseMagnet = () => {
      const el = magnet.el;
      // Springs back into place, then hands `translate` back to the stylesheet
      if (el) gsap.fromTo(el, { translate: el.style.translate || "0px 0px" }, { translate: "0px 0px", duration: 0.6, ease: "elastic.out(1, 0.5)", onComplete: () => { el.style.translate = ""; } });
      magnet.el = null;
      magnet.x = magnet.y = 0;
    };

    /*
     * One common cursor (free), and its own look for each kind of thing under it:
     *   grow      big clickable areas: ring swells
     *   snap      small buttons/links: ring wraps the element like a glowing outline
     *   external  links leaving the site: wrap + a ↗ badge
     *   download  files (CV, PDFs): wrap + a ↓ badge
     *   tab       navbar / filter tabs: pill with a glowing underline that slides between them
     *   text      fields: a blinking caret
     *   zoom      clickable images: glass lens with a magnifier
     *   drag      carousels and marquees: a ‹ DRAG › pill
     *   rotate    the hero cube: dashed orbit + rotate icon
     *   card      glass cards: a wide, faint halo
     *   heading   big headings: a glass lens that makes the letters under it glow
     *   read      body text: small and quiet, the spotlight dims, so reading is never covered
     *   label     data-cursor="View": filled disc + word
     */
    type Mode = "free" | "grow" | "snap" | "external" | "download" | "tab" | "text" | "zoom" | "drag" | "rotate" | "card" | "heading" | "read" | "label";
    const CLASSES: Record<Mode, string> = {
      free: "cursor-ring-free",
      grow: "cursor-ring-hover",
      snap: "cursor-ring-hover",
      external: "cursor-ring-hover cursor-ring-external",
      download: "cursor-ring-hover cursor-ring-download",
      tab: "cursor-ring-tab",
      text: "cursor-ring-text",
      zoom: "cursor-ring-zoom",
      drag: "cursor-ring-drag",
      rotate: "cursor-ring-rotate",
      card: "cursor-ring-card",
      heading: "cursor-ring-heading",
      read: "cursor-ring-read",
      label: "cursor-ring-label",
    };
    // Modes that sit on (and follow) a specific element rather than the pointer
    const wraps = (m: Mode) => m === "snap" || m === "tab" || m === "external" || m === "download";
    let mode: Mode = "free";
    let snapEl: HTMLElement | null = null;
    const SIZE = 44;
    const setMode = (next: Mode, el: HTMLElement | null = null, word = "") => {
      if (next === mode && el === snapEl) return;
      if (magnet.el && magnet.el !== el) releaseMagnet();
      // Elements that already use `translate` (centering, hover lifts) are left alone.
      if (el && next !== "tab" && wraps(next) && (el.style.translate || getComputedStyle(el).translate === "none")) {
        gsap.killTweensOf(el, "translate"); // grabbed again mid spring-back
        magnet.el = el;
      }
      mode = next;
      snapEl = el;
      if (label.current) label.current.textContent = word;
      r.className = `cursor-ring ${CLASSES[next]}`;
      let w = SIZE, h = SIZE, radius = SIZE / 2, scale = 1;
      if (wraps(next) && el) {
        const rect = el.getBoundingClientRect();
        const tab = next === "tab";
        const pad = tab ? 6 : 14;
        w = rect.width + pad;
        h = rect.height + pad;
        radius = tab ? h / 2 : Math.min((parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0) + 7, h / 2);
      } else if (next === "text") {
        w = 3; h = 26; radius = 2;
      } else if (next === "drag") {
        w = 108;
      } else {
        scale = { label: 2.6, grow: 1.7, external: 1.7, download: 1.7, rotate: 2, zoom: 1.6, card: 2.4, heading: 2.3, read: 0.5 }[next as string] ?? 1;
      }
      gsap.to(r, { width: w, height: h, borderRadius: radius, scale, duration: 0.55, ease: "expo.out", overwrite: "auto" });
      const dotScale = next === "free" || next === "read" ? 1 : next === "grow" || next === "rotate" || next === "card" ? 0.5 : 0;
      gsap.to(d, { scale: dotScale, duration: 0.35, ease: "expo.out", overwrite: "auto" });
      // The spotlight would wash out text, so it dims over anything you read
      gsap.to(g, { opacity: next === "read" || next === "heading" || next === "text" ? 0.2 : 1, duration: 0.5, overwrite: "auto" });
    };

    // Frame-rate independent easing towards a target
    const follow = (p: { x: number; y: number }, tx: number, ty: number, k: number, dt: number) => {
      const f = 1 - Math.pow(1 - k, dt * 60);
      p.x += (tx - p.x) * f;
      p.y += (ty - p.y) * f;
    };

    const tick = (_: number, deltaMS: number) => {
      if (!shown) return;
      const dt = Math.min(deltaMS / 1000, 0.05);

      // Snapped: the ring sits on the element, leaning a little towards the pointer
      let tx = mouse.x, ty = mouse.y, k = 0.16;
      if (wraps(mode) && snapEl) {
        const rect = snapEl.getBoundingClientRect();
        const out = mouse.x < rect.left - 12 || mouse.x > rect.right + 12 || mouse.y < rect.top - 12 || mouse.y > rect.bottom + 12;
        if (out || !snapEl.isConnected) setMode("free"); // it scrolled away under a resting pointer
        else {
          const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
          // Tabs stay level and only drift sideways, so the underline reads as an indicator
          tx = cx + (mouse.x - cx) * (mode === "tab" ? 0.06 : 0.12);
          ty = mode === "tab" ? cy : cy + (mouse.y - cy) * 0.12;
          k = 0.24;
          if (magnet.el === snapEl) {
            // Measured without our own offset, so the pull doesn't feed back into itself
            const mx = gsap.utils.clamp(-8, 8, (mouse.x - (cx - magnet.x)) * 0.18);
            const my = gsap.utils.clamp(-6, 6, (mouse.y - (cy - magnet.y)) * 0.18);
            const f = 1 - Math.pow(1 - 0.2, dt * 60);
            magnet.x += (mx - magnet.x) * f;
            magnet.y += (my - magnet.y) * f;
            snapEl.style.translate = `${magnet.x.toFixed(2)}px ${magnet.y.toFixed(2)}px`;
          }
        }
      }

      follow(dotP, mouse.x, mouse.y, 0.6, dt);
      const px = ringP.x, py = ringP.y;
      follow(ringP, tx, ty, k, dt);
      follow(glowP, mouse.x, mouse.y, 0.07, dt);
      dotSet.x(dotP.x); dotSet.y(dotP.y);
      ringSet.x(ringP.x); ringSet.y(ringP.y);
      glowSet.x(glowP.x); glowSet.y(glowP.y);

      // Free ring squashes along its direction of travel (turning the short way round);
      // any other mode straightens it out so outlines and the caret stay upright.
      const vx = ringP.x - px, vy = ringP.y - py;
      const v = Math.hypot(vx, vy);
      speed += (v - speed) * 0.25;
      const free = mode === "free";
      const targetAngle = free && v > 0.6 ? (Math.atan2(vy, vx) * 180) / Math.PI : free ? angle : 0;
      angle += ((((targetAngle - angle + 540) % 360) - 180) * (free ? 0.3 : 0.25));
      angle = ((angle + 540) % 360) - 180; // keep it in -180..180 so the short-way maths holds
      stretch += ((free ? Math.min(speed / 45, 0.45) : 0) - stretch) * 0.2;
      shapeSet({ rotation: angle, scaleX: (1 + stretch) * press.v, scaleY: (1 - stretch * 0.45) * press.v });

      // Comet: each dot chases the one in front; fades out once the cursor rests
      trailP.forEach((p, i) => {
        const lead = i ? trailP[i - 1] : dotP;
        follow(p, lead.x, lead.y, 0.42, dt);
        trailSet[i].x(p.x); trailSet[i].y(p.y);
      });
      trailAlpha += ((free ? Math.min(speed / 6, 1) : 0) - trailAlpha) * 0.15;
      tw.style.opacity = trailAlpha.toFixed(3);

      // Resting for a moment: let the ring breathe
      idle = speed < 0.05 ? idle + dt : 0;
      r.classList.toggle("cursor-ring-idle", free && idle > 1.2);
    };
    gsap.ticker.add(tick);

    const move = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!shown) {
        shown = true;
        for (const p of [dotP, ringP, glowP, ...trailP]) { p.x = mouse.x; p.y = mouse.y; }
        gsap.to(parts, { autoAlpha: 1, duration: 0.3 });
      }
    };

    const TEXT = "input:not([type='checkbox']):not([type='radio']):not([type='range']):not([type='submit']):not([type='button']):not([type='file']), textarea, [contenteditable='true']";
    const CLICKABLE = "a, button, [role='button'], select, label, summary";
    const TAB = "[role='tab'], [data-cursor-tabs] a, [data-cursor-tabs] button";
    const DRAG = ".carousel-mask, .marquee, [data-cursor-mode='drag']";
    const over = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest) return;
      const word = target.closest<HTMLElement>("[data-cursor]")?.dataset.cursor;
      if (word) return setMode("label", null, word);
      if (target.closest("[data-cursor-mode='rotate']")) return setMode("rotate");
      if (target.closest(TEXT)) return setMode("text");
      const tab = target.closest<HTMLElement>(TAB);
      if (tab) return setMode("tab", tab);
      // A whole strip you can drag reads as one thing, even over its clickable cards.
      if (target.closest(DRAG)) return setMode("drag");
      const el = target.closest<HTMLElement>(CLICKABLE);
      if (el) {
        // Over its picture (overlays such as gradients and hover tints usually sit on top of the img)
        const img = el.querySelector("img");
        if (img) {
          const b = img.getBoundingClientRect();
          if (e.clientX >= b.left && e.clientX <= b.right && e.clientY >= b.top && e.clientY <= b.bottom) return setMode("zoom");
        }
        const href = el.getAttribute("href") ?? "";
        const rect = el.getBoundingClientRect();
        // Only small targets get wrapped; a whole card outlined would feel heavy.
        const small = rect.width < 360 && rect.height < 110 ? el : null;
        if (el.hasAttribute("download") || /\.(pdf|docx?)(\?|#|$)/i.test(href)) return setMode("download", small);
        if (el.getAttribute("target") === "_blank" || /^(https?:)?\/\//.test(href) || /^mailto:/.test(href)) return setMode("external", small);
        return small ? setMode("snap", el) : setMode("grow");
      }
      if (target.closest("h1, h2")) return setMode("heading");
      if (target.closest("p, li, blockquote, figcaption, dd, td")) return setMode("read");
      if (target.closest(".glow-card")) return setMode("card");
      setMode("free");
    };

    // Press: ring tightens and a ripple rings out from the click point
    const down = (e: PointerEvent) => {
      gsap.to(press, { v: 0.85, duration: 0.15, ease: "power3.out", overwrite: true });
      if (mode === "rotate" || mode === "drag") r.classList.add("cursor-ring-grabbing");
      const ripple = document.createElement("div");
      ripple.className = "cursor-ripple";
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);
      gsap.fromTo(ripple, { scale: 0.2, opacity: 1 }, { scale: 1.6, opacity: 0, duration: 0.7, ease: "expo.out", onComplete: () => ripple.remove() });
      // A small burst of sparks flying outwards
      for (let i = 0; i < 8; i++) {
        const spark = document.createElement("div");
        spark.className = "cursor-spark";
        spark.style.left = `${e.clientX}px`;
        spark.style.top = `${e.clientY}px`;
        document.body.appendChild(spark);
        const a = (i / 8) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 22 + Math.random() * 18;
        gsap.fromTo(
          spark,
          { x: 0, y: 0, scale: 1, opacity: 1 },
          { x: Math.cos(a) * dist, y: Math.sin(a) * dist, scale: 0.2, opacity: 0, duration: 0.6 + Math.random() * 0.2, ease: "power3.out", onComplete: () => spark.remove() }
        );
      }
    };
    const up = () => {
      r.classList.remove("cursor-ring-grabbing");
      gsap.to(press, { v: 1, duration: 0.6, ease: "elastic.out(1, 0.45)", overwrite: true });
    };

    const leave = () => {
      shown = false;
      gsap.to(parts, { autoAlpha: 0, duration: 0.3 });
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("pointerleave", leave);
    return () => {
      gsap.ticker.remove(tick);
      releaseMagnet();
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <>
      <div ref={glow} aria-hidden className="cursor-glow" />
      {/* Fixed + z-index so its fading opacity doesn't drop the trail under the navbar */}
      <div ref={trailWrap} aria-hidden className="pointer-events-none fixed inset-0 z-[10000]" style={{ opacity: 0 }}>
        {Array.from({ length: TRAIL }, (_, i) => (
          <div
            key={i}
            className="cursor-trail"
            style={{ ["--s" as string]: `${7 - i * 0.6}px`, filter: `opacity(${1 - i / TRAIL})` }}
          />
        ))}
      </div>
      <div ref={ring} aria-hidden className="cursor-ring cursor-ring-free">
        <div ref={shape} className="cursor-shape">
          <div className="cursor-spin" />
        </div>
        <span className="cursor-orbit" />
        {/* Faces for the special modes; CSS shows the one matching the ring's mode */}
        <span className="cursor-face cursor-face-rotate">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
            <path d="M21 3v6h-6" />
            <ellipse cx="12" cy="12" rx="3.2" ry="8" opacity="0.55" />
          </svg>
        </span>
        <span className="cursor-face cursor-face-zoom">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M20 20l-4.2-4.2M11 8.5v5M8.5 11h5" />
          </svg>
        </span>
        <span className="cursor-face cursor-face-drag">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
          Drag
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </span>
        <span className="cursor-badge cursor-badge-external">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 16L16 8M9 8h7v7" />
          </svg>
        </span>
        <span className="cursor-badge cursor-badge-download">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v12M7 12l5 5 5-5" />
          </svg>
        </span>
        <span ref={label} className="cursor-label" />
      </div>
      <div ref={dot} aria-hidden className="cursor-dot" />
    </>
  );
}
