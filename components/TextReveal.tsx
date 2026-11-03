"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { SplitText } from "gsap/SplitText";
import { gsap, ScrollTrigger } from "@/lib/gsap";

gsap.registerPlugin(SplitText);

/*
 * Site-wide scroll reveal for text, on every page:
 *   h1 / h2 → letters flip up in 3D, one after another
 *   h3 / p / li / blockquote → slide up out of a soft blur as they scroll into view
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

/** Framer Motion writes its start state inline; leave those elements to it. */
const ownedByFramer = (el: HTMLElement) => /opacity|transform/.test(el.getAttribute("style") ?? "");

export default function TextReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.getElementById("page-content");
    if (!root) return;

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
          gsap.set(split.chars, { rotationX: -95, yPercent: 40, opacity: 0, transformOrigin: "50% 100% -12px" });
          const run = () =>
            gsap.to(split.chars, {
              rotationX: 0,
              yPercent: 0,
              opacity: 1,
              duration: 1,
              ease: "expo.out",
              stagger: { each: 0.025, from: "start" },
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
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
            !el.matches(".split-char, .hero-char")
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

        // Body text: rise out of a blur, batched so neighbours cascade
        const blocks = pick(scope, BLOCKS);
        if (!blocks.length) return;
        gsap.set(blocks, { opacity: 0, y: 28, filter: "blur(6px)" });
        const run = () =>
          ScrollTrigger.batch(blocks, {
            start: "top 92%",
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.9,
                ease: "power3.out",
                stagger: 0.07,
                overwrite: true,
                clearProps: "filter",
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
