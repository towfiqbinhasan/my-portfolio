"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePublicPathname } from "@/lib/useSiteMode";
import { LABELS } from "@/components/SectionRail";
import { sfx } from "@/lib/sfx";

/*
 * Animation mode, every page: the content "generates" itself as it comes into view.
 *   Text: every piece of text (headings included) decodes out of scrambled characters, left to right.
 *   Images: scanned in top to bottom, from dim grayscale to full colour (like the profile photo).
 *   Cards and modal panels: a scan line with a fading grid sweeps over them once.
 *   Console: a small fixed readout shows what is being generated and how far along it is.
 *
 * It works on the rendered DOM, so pages need no changes. Content that appears later (tabs,
 * filters, "load more", modals) is picked up by a MutationObserver. Text is only scrambled while
 * it decodes; the text node itself is edited, which the other observers on the page ignore.
 * Opt a block out with data-no-reveal (the home hero and profile animate themselves).
 */

const SKIP = [
  "[data-no-reveal]",
  "[data-world='hero']",
  "[aria-hidden='true']",
  ".marquee",
  ".big-marquee-track",
  ".carousel-mask",
  ".gen-hud",
  "nav",
  "svg",
  "script",
  "style",
  "noscript",
  "textarea",
  "select",
  "[contenteditable]",
].join(", ");

const CARDS = [
  ".glow-card",
  "[data-card-reveal]",
  ".project-tilt",
  "article",
  "[class*='rounded-'][class*='border']",
  "[role='dialog'] > div",
  ".fixed.inset-0 > div",
].join(", ");

/** Modals: their content gets its own entry in the console while it generates. */
const MODAL = "[role='dialog'], .fixed.inset-0";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGIT = "0123456789";
const pick = (s: string) => s[(Math.random() * s.length) | 0];

/** A random stand-in of the same kind, so the line keeps roughly its width while it decodes. */
const noise = (c: string) =>
  /[A-Z]/.test(c) ? pick(UPPER) : /[a-z]/.test(c) ? pick(LOWER) : /\d/.test(c) ? pick(DIGIT) : c;

const scramble = (text: string, revealed: number) =>
  revealed >= text.length ? text : text.slice(0, Math.max(revealed, 0)) + Array.from(text.slice(Math.max(revealed, 0)), noise).join("");

type Unit = { el: HTMLElement; label: string; total: number; done: number; modal: boolean };

export default function GenerateLayer() {
  const pathname = usePublicPathname();
  const hud = useRef<HTMLDivElement>(null);
  const hudLabel = useRef<HTMLSpanElement>(null);
  const hudPct = useRef<HTMLSpanElement>(null);
  const hudBar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const content = document.getElementById("page-content");
    if (!content) return;

    const seen = new WeakSet<Node>();
    const originals = new Map<Text, string>(); // text currently scrambled → its real text
    const pending = new Map<Element, Text[]>(); // text waiting to come into view, by its block
    const waitingImgs = new Set<HTMLImageElement>();
    const timers: ReturnType<typeof setTimeout>[] = [];
    const tweens: gsap.core.Tween[] = [];
    const triggers: ScrollTrigger[] = [];
    const units: Unit[] = [];
    const modalUnits = new Map<Element, Unit>();
    let scrollActive: Unit | null = null;
    let pageUnit: Unit;

    /* ---------- console ---------- */
    const current = () => {
      for (const u of modalUnits.values()) if (u.el.isConnected && u.done < u.total) return u;
      return scrollActive;
    };
    const paint = () => {
      const h = hud.current;
      if (!h) return;
      const u = current();
      h.dataset.on = u ? "true" : "false";
      if (!u) return;
      const pct = u.total ? Math.round((u.done / u.total) * 100) : 100;
      const complete = pct >= 100;
      h.dataset.complete = complete ? "true" : "false";
      hudLabel.current!.textContent = complete ? `${u.label} generated` : `generating ${u.label}`;
      hudPct.current!.textContent = `${pct}%`;
      gsap.to(hudBar.current, { scaleX: pct / 100, duration: 0.4, ease: "power2.out", overwrite: true });
    };
    const tick = (u: Unit) => {
      u.done = Math.min(u.done + 1, u.total);
      if (u === current() || u.modal) paint();
    };

    const labelOf = (el: Element, fallback: string) => {
      const world = (el as HTMLElement).dataset?.world;
      if (world && LABELS[world]) return LABELS[world];
      const heading = el.querySelector("h1, h2, h3")?.textContent?.trim().replace(/\s+/g, " ");
      return heading && heading.length <= 32 ? heading : fallback;
    };

    const unitOf = (node: Node): Unit => {
      const el = node instanceof Element ? node : node.parentElement!;
      const modal = el.closest(MODAL);
      if (modal) {
        let u = modalUnits.get(modal);
        if (!u) {
          u = { el: modal as HTMLElement, label: "details", total: 0, done: 0, modal: true };
          modalUnits.set(modal, u);
        }
        return u;
      }
      return units.find((u) => u.el.contains(el)) ?? pageUnit;
    };

    /* ---------- text ---------- */
    const decode = (nodes: Text[], unit: Unit) => {
      const live = nodes.filter((n) => n.isConnected);
      unit.done += nodes.length - live.length; // replaced before it was seen: nothing to do
      if (!live.length) return paint();
      const texts = live.map((n) => n.data);
      const offsets: number[] = [];
      let total = 0;
      texts.forEach((t) => {
        offsets.push(total);
        total += t.length;
      });
      const written = [...texts];
      const finished = live.map(() => false);
      live.forEach((n, i) => originals.set(n, texts[i]));
      const finish = (i: number) => {
        if (finished[i]) return;
        finished[i] = true;
        originals.delete(live[i]);
        tick(unit);
      };
      const p = { v: 0 };
      let last = 0;
      const write = (final: boolean) => {
        const revealed = final ? total : Math.floor(p.v * total);
        live.forEach((n, i) => {
          if (finished[i]) return;
          // React (or a count-up) changed this text meanwhile: leave it be.
          if (n.data !== written[i]) return finish(i);
          written[i] = scramble(texts[i], revealed - offsets[i]);
          n.data = written[i];
          if (revealed - offsets[i] >= texts[i].length) finish(i);
        });
      };
      tweens.push(
        gsap.to(p, {
          v: 1,
          duration: gsap.utils.clamp(0.45, 1.6, 0.3 + total * 0.011),
          ease: "power1.inOut",
          onUpdate: () => {
            const now = performance.now();
            if (now - last < 45) return; // fresh noise ~20 times a second, not every frame
            last = now;
            write(false);
            sfx.decode();
          },
          onComplete: () => write(true),
        })
      );
    };

    const textIo = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          textIo.unobserve(e.target);
          const nodes = pending.get(e.target);
          pending.delete(e.target);
          if (nodes?.length) decode(nodes, unitOf(e.target));
        }),
      { rootMargin: "0px 0px -6% 0px" }
    );

    /* ---------- images ---------- */
    const imgIo = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const img = e.target as HTMLImageElement;
          imgIo.unobserve(img);
          waitingImgs.delete(img);
          img.classList.remove("gen-img-wait");
          img.classList.add("gen-img");
          sfx.scan();
          const unit = unitOf(img);
          timers.push(
            setTimeout(() => {
              img.classList.remove("gen-img");
              tick(unit);
            }, 1500)
          );
        }),
      // Threshold 0: Chrome counts the image's own clip-path (it starts fully clipped), so its
      // visible ratio stays 0 and any higher threshold would never fire (stuck in modals).
      { rootMargin: "0px 0px -6% 0px", threshold: 0 }
    );

    /* ---------- cards ---------- */
    const cardIo = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          cardIo.unobserve(e.target);
          const card = e.target as HTMLElement;
          const unit = unitOf(card);
          // Buttons wrapping a rounded card (project cards) get the line on the card itself.
          const host =
            getComputedStyle(card).borderRadius === "0px" &&
            !card.matches(MODAL + " > div") &&
            card.firstElementChild instanceof HTMLElement
              ? card.firstElementChild
              : card;
          const wasStatic = getComputedStyle(host).position === "static";
          if (wasStatic) host.style.position = "relative";
          const overlay = document.createElement("div");
          overlay.className = "gen-scan";
          overlay.setAttribute("aria-hidden", "true");
          host.appendChild(overlay);
          sfx.scan();
          timers.push(
            setTimeout(() => {
              overlay.remove();
              if (wasStatic) host.style.position = "";
              tick(unit);
            }, 1300)
          );
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    /* ---------- discovery ---------- */
    const roots = () =>
      [content, document.querySelector("body > footer"), ...document.querySelectorAll(MODAL)].filter(
        (r): r is HTMLElement => r instanceof HTMLElement && (r === content || !content.contains(r))
      );

    const scan = () => {
      roots().forEach((root) => {
        // Text, grouped by the block that holds it (a heading split into letters is one block)
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
          acceptNode: (n) => {
            if (seen.has(n)) return NodeFilter.FILTER_REJECT;
            const parent = n.parentElement;
            const text = n.nodeValue?.trim() ?? "";
            const letter = parent?.classList.contains("split-char");
            if (!parent || text.length < (letter ? 1 : 2)) return NodeFilter.FILTER_REJECT;
            if (parent.closest(SKIP) || parent.getClientRects().length === 0) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          },
        });
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          seen.add(n);
          const parent = n.parentElement!;
          const block = parent.classList.contains("split-char") ? parent.closest("h1, h2, h3, h4") ?? parent : parent;
          if (!pending.has(block)) {
            pending.set(block, []);
            textIo.observe(block);
          }
          pending.get(block)!.push(n as Text);
          unitOf(n).total++;
        }

        // Images
        root.querySelectorAll("img").forEach((img) => {
          if (seen.has(img) || img.closest(SKIP)) return;
          const r = img.getBoundingClientRect();
          if (r.width < 60 || r.height < 48) return;
          seen.add(img);
          img.classList.add("gen-img-wait");
          waitingImgs.add(img);
          imgIo.observe(img);
          unitOf(img).total++;
        });

        // Cards and modal panels (the outermost one only)
        root.querySelectorAll<HTMLElement>(CARDS).forEach((c) => {
          if (seen.has(c) || c.closest(SKIP) || c.parentElement?.closest(CARDS)) return;
          const pos = getComputedStyle(c).position;
          if (pos === "absolute" || pos === "fixed" || pos === "sticky") return;
          const r = c.getBoundingClientRect();
          if (r.width < 140 || r.height < 90) return;
          seen.add(c);
          cardIo.observe(c);
          unitOf(c).total++;
        });
      });
      paint();
    };

    const start = () => {
      pageUnit = {
        el: content,
        label: labelOf(content, pathname.split("/").filter(Boolean).pop() ?? "page"),
        total: 0,
        done: 0,
        modal: false,
      };
      // Top-level sections are the console's steps (the pinned projects row is measured by its spacer).
      Array.from(content.querySelectorAll<HTMLElement>("section"))
        .filter((el) => !el.parentElement?.closest("section") && !el.closest("[data-no-reveal], [data-world='hero']"))
        .forEach((el) => units.push({ el, label: labelOf(el, pageUnit.label), total: 0, done: 0, modal: false }));
      const footer = document.querySelector<HTMLElement>("body > footer");
      if (footer) units.push({ el: footer, label: "footer", total: 0, done: 0, modal: false });

      [...units, pageUnit].forEach((u) => {
        const spacer = u.el.parentElement?.classList.contains("pin-spacer") ? u.el.parentElement : null;
        triggers.push(
          ScrollTrigger.create({
            trigger: spacer ?? u.el,
            start: u === pageUnit ? "top top" : "top 60%",
            end: u === pageUnit ? "bottom bottom" : "bottom 40%",
            refreshPriority: -1, // after the pinned sections, so their spacing is counted
            onToggle: (self) => {
              if (self.isActive) scrollActive = u;
              else if (scrollActive === u) scrollActive = null;
              // Sections win over the page as a whole
              if (!scrollActive || scrollActive === pageUnit) {
                const inner = units.find((x) => {
                  const r = x.el.getBoundingClientRect();
                  return r.top < innerHeight * 0.6 && r.bottom > innerHeight * 0.4;
                });
                scrollActive = inner ?? (pageUnit.total ? pageUnit : scrollActive);
              }
              paint();
            },
          })
        );
      });

      scan();
      ScrollTrigger.refresh();
      observer.observe(content, { childList: true, subtree: true });
      observer.observe(document.body, { childList: true, subtree: true });
    };

    // New content (tabs, filters, modals) gets the same treatment.
    let frame = 0;
    const observer = new MutationObserver((records) => {
      const added = records.some((r) =>
        Array.from(r.addedNodes).some((n) => !(n instanceof HTMLElement && n.matches(".gen-scan, .hk-lock, .hk-frame")))
      );
      if (!added) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });

    // Begin once the page loader has lifted (with a fallback in case it never fires).
    let started = false;
    const go = () => {
      if (started) return;
      started = true;
      timers.push(setTimeout(start, 300));
    };
    window.addEventListener("loader:done", go);
    timers.push(setTimeout(go, 2200));

    return () => {
      window.removeEventListener("loader:done", go);
      observer.disconnect();
      cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
      [textIo, imgIo, cardIo].forEach((o) => o.disconnect());
      tweens.forEach((t) => t.kill());
      triggers.forEach((t) => t.kill());
      originals.forEach((text, node) => (node.data = text));
      waitingImgs.forEach((img) => img.classList.remove("gen-img-wait"));
      document.querySelectorAll(".gen-scan").forEach((o) => o.remove());
      document.querySelectorAll(".gen-img").forEach((img) => img.classList.remove("gen-img"));
    };
  }, [pathname]);

  return (
    <div
      ref={hud}
      data-on="false"
      data-complete="false"
      aria-hidden
      className="gen-hud pointer-events-none fixed bottom-4 left-4 z-[120] flex w-[min(300px,calc(100vw-6rem))] items-center gap-2.5 rounded-full border border-sky-400/30 bg-[#0a1428]/80 px-3.5 py-2 font-mono text-[10px] text-sky-200/90 shadow-[0_0_24px_-8px_rgba(61,147,255,0.7)] backdrop-blur-md sm:bottom-6 sm:left-6 sm:text-[11px]"
    >
      <span className="gen-hud-caret text-cyan-300">&gt;</span>
      <span ref={hudLabel} className="min-w-0 flex-1 truncate lowercase" />
      <span className="relative h-1 w-12 shrink-0 overflow-hidden rounded-full bg-sky-400/15">
        <span
          ref={hudBar}
          className="gen-hud-bar absolute inset-0 origin-left scale-x-0 rounded-full bg-gradient-to-r from-sky-500 to-cyan-300"
        />
      </span>
      <span ref={hudPct} className="w-8 shrink-0 text-right tabular-nums">
        0%
      </span>
    </div>
  );
}
