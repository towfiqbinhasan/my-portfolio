"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { SplitText } from "gsap/SplitText";
import { gsap, ScrollTrigger } from "@/lib/gsap";

gsap.registerPlugin(SplitText);

/*
 * Site-wide scroll reveal for text, on every page:
 *   h1 / h2 → letters flip up in 3D, one after another, out of a soft glow
 *   h3 / p / li / blockquote → tilt up out of a soft blur as they scroll into view
 *     (phones: a plain fade + rise, since animating blur on many blocks drops frames there)
 *   cards (bordered, rounded boxes: certificates, gadgets, papers...) → rise and tilt
 *     into place in a cascade (phones: a short fade + rise)
 *
 * It works on whatever the page renders inside #page-content, so pages need no
 * changes. Opt a block out with data-no-reveal. Content added later (tabs,
 * filters, "load more") is picked up by a MutationObserver.
 */

const HEADINGS = "h1, h2";
const BLOCKS = "h3, p, li, blockquote";
// Things that animate themselves already, or must never be hidden.
const SKIP = [
  "[data-no-reveal]",
  "[data-world='hero']",
  "nav",
  "form",
  "[role='dialog']",
  ".modal-scroll",
  ".marquee",
  ".ring-card",
  ".stack-card",
  ".project-tilt",
  ".timeline-item",
  "button",
].join(", ");

// Cards: any sizeable bordered, rounded box. Carousels and pinned/3D pieces animate themselves.
const CARDS = "[class*='rounded-'][class*='border'], article";
const CARD_SKIP = [
  "[data-no-reveal]",
  "[data-world='hero']",
  "nav",
  "[role='dialog']",
  ".modal-scroll",
  ".marquee",
  ".carousel-mask",
  ".ring-card",
  ".stack-card",
  ".project-tilt",
  ".timeline-item",
].join(", ");

/** Framer Motion writes its start state inline; leave those elements to it. */
const ownedByFramer = (el: HTMLElement) => /opacity|transform/.test(el.getAttribute("style") ?? "");

export default function TextReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.getElementById("page-content");
    if (!root) return;

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const seen = new WeakSet<Element>();
    const splits: SplitText[] = [];
    let live = false; // triggers are only created once the page loader has lifted
    const queued: (() => void)[] = [];
    const ctx = gsap.context(() => {});

    // Headings only animate their letters, so a Framer entrance on the heading itself is fine;
    // body blocks animate the element, so Framer-owned ones are left alone.
    const pick = (scope: ParentNode, selector: string, framerOk = false) =>
      Array.from(scope.querySelectorAll<HTMLElement>(selector)).filter((el) => {
        if (seen.has(el) || el.closest(SKIP) || (!framerOk && ownedByFramer(el))) return false;
        if (!el.textContent?.trim() || el.querySelector(".reveal-word")) return false;
        // Skip a block nested in another block we already animate (e.g. <p> inside <li>).
        if (el.parentElement?.closest(BLOCKS)) return false;
        seen.add(el);
        return true;
      });

    const setup = (scope: ParentNode) =>
      ctx.add(() => {
        // Headings: 3D letter flip
        pick(scope, HEADINGS, true).forEach((el) => {
          const split = SplitText.create(el, { type: "words,chars", wordsClass: "split-word", charsClass: "split-char" });
          splits.push(split);
          // Gradient text (bg-clip-text) can't paint through transformed letters, so each
          // letter gets the gradient itself, inline, so it never depends on stylesheet timing.
          split.chars.forEach((c) => {
            const grad = c.closest<HTMLElement>(".bg-clip-text");
            if (!grad) return;
            const bg = getComputedStyle(grad).backgroundImage;
            Object.assign((c as HTMLElement).style, {
              backgroundImage: bg,
              backgroundClip: "text",
              webkitBackgroundClip: "text",
              webkitTextFillColor: "transparent",
              color: "transparent",
            });
          });
          gsap.set(el, { perspective: 600 });
          gsap.set(split.chars, { rotationX: -95, yPercent: 50, scale: 0.9, opacity: 0, transformOrigin: "50% 100% -12px" });
          const run = () =>
            gsap.to(split.chars, {
              rotationX: 0,
              yPercent: 0,
              scale: 1,
              opacity: 1,
              duration: mobile ? 0.8 : 1.2,
              ease: "expo.out",
              stagger: { each: mobile ? 0.015 : 0.022, from: "start" },
              scrollTrigger: { trigger: el, start: mobile ? "top 94%" : "top 88%", once: true },
              // Safety net: if the heading's own Framer entrance missed (fast scroll), show it anyway.
              onComplete: () => {
                if (+getComputedStyle(el).opacity < 0.99) gsap.set(el, { opacity: 1, y: 0, filter: "none" });
              },
            });
          if (live) run();
          else queued.push(run);
        });

        // Anything Framer reveals on its own (text, cards, columns): its in-view check can miss
        // an element on a very fast scroll or a slow device, leaving it invisible. GSAP's
        // scroll math doesn't miss, so show those shortly after they enter regardless.
        const framerBlocks = Array.from(scope.querySelectorAll<HTMLElement>('[style*="opacity"]')).filter(
          (el) =>
            // "opacity:0" (server-rendered) or "opacity: 0" (set in the browser), not 0.5 etc.
            /opacity:\s*0(?![.\d])/.test(el.getAttribute("style") ?? "") &&
            !seen.has(el) &&
            !el.closest(SKIP) &&
            !el.matches(".split-char, .hero-char, .glow-card") // glow cards follow the scroll on their own
        );
        framerBlocks.forEach((el) => seen.add(el));
        if (framerBlocks.length) {
          const guard = () =>
            ScrollTrigger.batch(framerBlocks, {
              start: "top 85%",
              once: true,
              onEnter: (batch) =>
                gsap.delayedCall(1.4, () =>
                  batch.forEach((el) => {
                    if (+getComputedStyle(el).opacity < 0.99) gsap.to(el, { opacity: 1, y: 0, filter: "none", duration: 0.6, ease: "power3.out" });
                  })
                ),
            });
          if (live) guard();
          else queued.push(guard);
        }

        // Cards: rise and tilt up into place, batched so a grid cascades row by row
        const cards = Array.from(scope.querySelectorAll<HTMLElement>(CARDS)).filter((el) => {
          if (seen.has(el) || el.closest(CARD_SKIP) || el.closest("[data-card-reveal]")) return false;
          // Already animated by Framer (itself or a wrapper around it)
          if (el.closest("[style*='opacity'], [style*='transform']")) return false;
          const pos = getComputedStyle(el).position;
          if (pos === "absolute" || pos === "fixed" || pos === "sticky") return false; // decorative frames, overlays
          const r = el.getBoundingClientRect();
          if (r.width < 140 || r.height < 90) return false; // chips, badges, small buttons
          el.dataset.cardReveal = "";
          seen.add(el);
          return true;
        });
        if (cards.length) {
          // CSS transitions on transform would smear the scroll-driven tween, so they're paused meanwhile.
          gsap.set(
            cards,
            mobile
              ? { opacity: 0, y: 40, scale: 0.97, transition: "none" }
              : { opacity: 0, y: 80, scale: 0.94, rotationX: -12, transformPerspective: 1000, transformOrigin: "50% 0%", transition: "none" }
          );
          const run = () =>
            ScrollTrigger.batch(cards, {
              start: mobile ? "top 95%" : "top 90%",
              once: true,
              onEnter: (batch) =>
                gsap.to(batch, {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  ...(mobile ? {} : { rotationX: 0 }),
                  duration: mobile ? 0.7 : 1.1,
                  ease: "expo.out",
                  stagger: mobile ? 0.06 : 0.1,
                  overwrite: true,
                  clearProps: "transform,opacity,transition",
                }),
            });
          if (live) run();
          else queued.push(run);
        }

        // Body text: tilt up out of a blur, batched so neighbours cascade
        const blocks = pick(scope, BLOCKS);
        if (!blocks.length) return;
        gsap.set(
          blocks,
          mobile
            ? { opacity: 0, y: 22 }
            : { opacity: 0, y: 42, rotationX: -14, transformPerspective: 900, transformOrigin: "50% 0%", filter: "blur(8px)" }
        );
        const run = () =>
          ScrollTrigger.batch(blocks, {
            start: mobile ? "top 96%" : "top 92%",
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                ...(mobile ? {} : { rotationX: 0, filter: "blur(0px)" }),
                duration: mobile ? 0.7 : 1.1,
                ease: mobile ? "power3.out" : "expo.out",
                stagger: mobile ? 0.05 : 0.08,
                overwrite: true,
                clearProps: "filter,transform",
              }),
          });
        if (live) run();
        else queued.push(run);
      });

    setup(root);

    const goLive = () => {
      if (live) return;
      live = true;
      ctx.add(() => queued.splice(0).forEach((fn) => fn()));
      ScrollTrigger.refresh();
    };
    window.addEventListener("loader:done", goLive);
    const fallback = setTimeout(goLive, 1800);

    // New content (tabs, filters, modals closing...) gets the same treatment.
    let pending = 0;
    const observer = new MutationObserver((records) => {
      if (records.every((r) => r.addedNodes.length === 0)) return;
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(() => setup(root));
    });
    observer.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(pending);
      clearTimeout(fallback);
      window.removeEventListener("loader:done", goLive);
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, [pathname]);

  return null;
}
