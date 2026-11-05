"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePublicPathname } from "@/lib/useSiteMode";
import { LABELS } from "@/components/SectionRail";
import { sfx } from "@/lib/sfx";

/*
 * Animation mode, every page: a "terminal breach" look as you scroll.
 *   Sections: as each one scrolls in, a HUD frame locks onto it (corner brackets, a top edge
 *     that draws itself), blue lightning crackles along its edge and strikes down into it with
 *     a flash, a laser scans down,
 *     glitch bars flicker, and a command is typed out at its top ("./decrypt --module=skills")
 *     followed by ACCESS GRANTED. Its heading glitches as it locks in, and again on hover.
 *   Cards: corner brackets snap onto each card as it scrolls in, an arc sparks along its top
 *     edge, and a "TARGET ✓" readout shows.
 *   Screen: faint CRT scanlines and vignette; fast scrolling tears the picture with a blue band
 *     and lightning arcs across the screen. Every few seconds, even at rest, a burst of electric
 *     interference ("jir-jir") flickers in front: a band of blue static with jittering streaks,
 *     an arc crawling along a screen edge and a spray of sparks.
 *   Very wide screens: a memory-address gutter on the left that runs with the scroll.
 *   Sound (when the navbar's sound button is on): each step above has its own effect, see lib/sfx.
 *
 * It decorates the rendered DOM (top-level <section>s in #page-content), so pages need no changes.
 * The home hero animates itself and is left out. Reduced motion: none of this runs.
 */

const VERBS = ["decrypt", "mount", "inject", "exec", "unlock", "trace"];

/** Cards that get a target lock: sizeable bordered, rounded boxes (the outermost one only). */
const LOCK_CARDS = ".glow-card, .project-tilt, article, [class*='rounded-'][class*='border']";
const LOCK_SKIP = "[data-no-reveal], [data-world='hero'], nav, [aria-hidden='true'], .marquee, .carousel-mask";
const hex = (n: number, len = 4) => n.toString(16).toUpperCase().padStart(len, "0");

/* ---------- lightning ---------- */

type P = [number, number];

/** A jagged path from a to b: each pass splits every segment and kicks its middle sideways. */
function boltPath(a: P, b: P, spread: number, passes = 5): P[] {
  let pts: P[] = [a, b];
  let off = spread;
  for (let p = 0; p < passes; p++) {
    const next: P[] = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1] = pts[i];
      const [x2, y2] = pts[i + 1];
      const len = Math.hypot(x2 - x1, y2 - y1) || 1;
      const kick = (Math.random() - 0.5) * off;
      next.push([(x1 + x2) / 2 - ((y2 - y1) / len) * kick, (y1 + y2) / 2 + ((x2 - x1) / len) * kick], pts[i + 1]);
    }
    pts = next;
    off /= 2;
  }
  return pts;
}

/** Draws a blue bolt (wide glow, bright stroke, white-hot core), optionally with forks. */
function drawBolt(ctx: CanvasRenderingContext2D, a: P, b: P, spread: number, alpha: number, forks: boolean) {
  const main = boltPath(a, b, spread);
  const strokes = [main];
  if (forks) {
    for (let i = 0; i < 2; i++) {
      const from = main[1 + ((Math.random() * main.length * 0.7) | 0)];
      const to: P = [from[0] + (Math.random() - 0.5) * spread * 1.6, from[1] + (0.2 + Math.random() * 0.6) * spread];
      strokes.push(boltPath(from, to, spread * 0.4, 4));
    }
  }
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.shadowColor = "#3b82f6";
  const layers: [number, string, number][] = [
    [7, `rgba(37,99,235,${0.35 * alpha})`, 22],
    [2.6, `rgba(96,165,250,${0.9 * alpha})`, 10],
    [1, `rgba(236,246,255,${alpha})`, 0],
  ];
  layers.forEach(([width, color, blur]) => {
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.shadowBlur = blur;
    strokes.forEach((s, i) => {
      ctx.globalAlpha = i ? 0.55 : 1; // forks are fainter than the main channel
      ctx.beginPath();
      s.forEach(([x, y], j) => (j ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.stroke();
    });
  });
  ctx.restore();
}

/** Fades what is on a canvas (so bolts flicker out) without painting over the page. */
function fade(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number) {
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = `rgba(0,0,0,${amount})`;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "source-over";
}

/** A short lightning storm over a section: an arc crackling along its top edge and strikes
 *  down into it (each calls onStrike, for the flash). Returns a function that stops it. */
function storm(canvas: HTMLCanvasElement, w: number, h: number, onStrike: () => void) {
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  let raf = 0;
  let last = 0;
  let next = 0;
  const draw = (t: number) => {
    raf = requestAnimationFrame(draw);
    if (t - last < 40) return; // ~25 fps reads as flicker, which is the point
    last = t;
    fade(ctx, w, h, 0.5);
    if (Math.random() < 0.75) drawBolt(ctx, [34, 8], [w - 34, 8], 22, 0.75, false);
    if (t >= next) {
      next = t + 110 + Math.random() * 170;
      const x = 40 + Math.random() * (w - 80);
      drawBolt(ctx, [x, 8], [x + (Math.random() - 0.5) * w * 0.4, h * (0.35 + Math.random() * 0.55)], Math.min(w, h) * 0.3, 1, true);
      onStrike();
    }
  };
  raf = requestAnimationFrame(draw);
  return () => {
    cancelAnimationFrame(raf);
    ctx.clearRect(0, 0, w, h);
  };
}

const el = (tag: string, cls: string, parent: HTMLElement) => {
  const node = document.createElement(tag);
  node.className = cls;
  parent.appendChild(node);
  return node;
};

export default function HackLayer() {
  const pathname = usePublicPathname();
  const screen = useRef<HTMLDivElement>(null);
  const gutter = useRef<HTMLDivElement>(null);
  const arcs = useRef<HTMLCanvasElement>(null);
  const band = useRef<HTMLDivElement>(null);

  /* ---------- sections ---------- */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const content = document.getElementById("page-content");
    if (!content) return;
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    const frames: HTMLElement[] = [];
    const restore: HTMLElement[] = []; // sections we had to make position: relative
    const stops: (() => void)[] = [];
    const triggers: ScrollTrigger[] = [];
    const timelines: gsap.core.Timeline[] = [];
    const timers: ReturnType<typeof setTimeout>[] = [];

    const labelOf = (sec: HTMLElement) => {
      const world = sec.dataset.world;
      const text =
        (world && LABELS[world]) ||
        sec.querySelector("h1, h2")?.textContent?.trim().replace(/\s+/g, " ") ||
        pathname.split("/").filter(Boolean).pop() ||
        "home";
      return text.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 22) || "module";
    };

    const breach = (sec: HTMLElement, index: number) => {
      const spacer = sec.parentElement?.classList.contains("pin-spacer") ? sec.parentElement : null;
      if (getComputedStyle(sec).position === "static") {
        if (spacer) return; // pinned by GSAP: leave its positioning alone
        sec.style.position = "relative";
        restore.push(sec);
      }

      const frame = document.createElement("div");
      frame.className = "hk-frame";
      frame.setAttribute("aria-hidden", "true");
      const flash = el("span", "hk-flash", frame);
      const canvas = el("canvas", "hk-storm", frame) as HTMLCanvasElement;
      const corners = ["tl", "tr", "bl", "br"].map((c) => el("span", `hk-corner hk-${c}`, frame));
      const edge = el("span", "hk-edge", frame);
      const laser = el("span", "hk-laser", frame);
      const slices = Array.from({ length: 4 }, () => el("span", "hk-slice", frame));
      const tag = el("div", "hk-tag", frame);
      const prompt = el("span", "hk-prompt", tag);
      const cmd = el("span", "hk-cmd", tag);
      const caret = el("span", "hk-caret", tag);
      const ok = el("span", "hk-ok", tag);
      const addr = el("div", "hk-addr", frame);
      caret.textContent = "_";
      sec.appendChild(frame);
      frames.push(frame);

      const label = labelOf(sec);
      const verb = VERBS[index % VERBS.length];
      prompt.textContent = mobile ? "~# " : "root@towfiq:~# ";
      const command = mobile ? `./${verb} ${label}` : `./${verb} --module=${label}`;
      const address = `SEC_${String(index + 1).padStart(2, "0")} · 0x${hex((Math.random() * 0xffff) | 0)}`;
      const heading = sec.querySelector<HTMLElement>("h2, h1");

      const tl = gsap.timeline({ paused: true });
      timelines.push(tl);

      // Frame locks on
      tl.set(frame, { autoAlpha: 1 })
        .call(sfx.lock, [], 0)
        .fromTo(corners, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.55, ease: "expo.out", stagger: 0.06 }, 0)
        .to(corners, { autoAlpha: 0.55, duration: 0.8 }, 1.4)
        .fromTo(edge, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "expo.inOut" }, 0.05)
        .to(edge, { autoAlpha: 0.35, duration: 0.8 }, 1.4);

      // Lightning over the part of the section that is on screen, each strike lighting it up
      let stop = () => {};
      stops.push(() => stop());
      const strike = () => gsap.fromTo(flash, { opacity: mobile ? 0.35 : 0.5 }, { opacity: 0, duration: 0.28, ease: "power2.out", overwrite: true });
      tl.call(
        () => {
          const h = Math.min(sec.offsetHeight, innerHeight);
          canvas.style.height = flash.style.height = `${h}px`;
          stop = storm(canvas, sec.clientWidth, h, strike);
          sfx.storm(1.3);
        },
        [],
        0
      ).fromTo(canvas, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.5, ease: "power2.in", onComplete: () => stop() }, 1.2);

      // Laser sweep
      tl.call(() => sfx.laser(1.15), [], 0.1)
        .fromTo(laser, { y: 0, autoAlpha: 1 }, { y: () => Math.min(sec.offsetHeight, innerHeight) - 2, duration: 1.15, ease: "power2.inOut" }, 0.1)
        .to(laser, { autoAlpha: 0, duration: 0.25 }, 1.15);

      // Glitch bars flicker
      tl.call(sfx.glitch, [], 0.08);
      for (let i = 0; i < 7; i++) {
        tl.call(
          () =>
            slices.forEach((s) => {
              const on = Math.random() < 0.7 && i < 6;
              Object.assign(s.style, {
                display: on ? "block" : "none",
                top: `${Math.random() * 85}%`,
                height: `${3 + Math.random() * 14}px`,
                left: `${Math.random() * 30}%`,
                right: `${Math.random() * 30}%`,
                transform: `translateX(${(Math.random() - 0.5) * 40}px)`,
              });
            }),
          [],
          0.08 + i * 0.07
        );
      }

      // Command typed out, then the verdict
      const typing = { n: 0 };
      tl.to(
        typing,
        {
          n: command.length,
          duration: command.length * 0.028,
          ease: "none",
          onUpdate: () => {
            const next = command.slice(0, Math.round(typing.n));
            if (next.length > cmd.textContent!.length) sfx.type();
            cmd.textContent = next;
          },
        },
        0.2
      )
        .call(
          () => {
            ok.textContent = " [ ACCESS GRANTED ]";
            sfx.granted();
            addr.textContent = address;
          },
          [],
          0.25 + command.length * 0.028
        )
        .fromTo(ok, { autoAlpha: 0, x: -6 }, { autoAlpha: 1, x: 0, duration: 0.3, ease: "power2.out" }, 0.25 + command.length * 0.028)
        .fromTo(addr, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: "steps(3)" }, 0.3 + command.length * 0.028)
        .to(tag, { autoAlpha: 0.65, duration: 0.8 }, 2.4);

      // Heading glitches as it locks in (its letters have flipped in by then)
      if (heading) {
        heading.classList.add("hk-head");
        tl.call(
          () => {
            heading.classList.remove("hk-glitch");
            void heading.offsetWidth;
            heading.classList.add("hk-glitch");
            sfx.glitch();
            timers.push(setTimeout(() => heading.classList.remove("hk-glitch"), 700));
          },
          [],
          1.05
        );
      }

      triggers.push(
        ScrollTrigger.create({
          trigger: spacer ?? sec,
          start: mobile ? "top 75%" : "top 62%",
          once: true,
          refreshPriority: -1,
          onEnter: () => tl.play(),
        })
      );
    };

    const start = () => {
      Array.from(content.querySelectorAll<HTMLElement>("section"))
        .filter((s) => !s.parentElement?.closest("section") && !s.closest("[data-world='hero']") && s.offsetHeight > 120)
        .forEach(breach);
      ScrollTrigger.refresh();
    };

    let started = false;
    const go = () => {
      if (started) return;
      started = true;
      timers.push(setTimeout(start, 400));
    };
    window.addEventListener("loader:done", go);
    timers.push(setTimeout(go, 2200));

    return () => {
      window.removeEventListener("loader:done", go);
      timers.forEach(clearTimeout);
      stops.forEach((s) => s());
      timelines.forEach((t) => t.kill());
      triggers.forEach((t) => t.kill());
      frames.forEach((f) => f.remove());
      restore.forEach((s) => (s.style.position = ""));
      document.querySelectorAll(".hk-head").forEach((h) => h.classList.remove("hk-head", "hk-glitch"));
    };
  }, [pathname]);

  /* ---------- cards: target lock as each one scrolls in ---------- */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const content = document.getElementById("page-content");
    if (!content) return;

    const seen = new WeakSet<Element>();
    const locks = new Set<HTMLElement>();
    const restore: HTMLElement[] = []; // cards we had to make position: relative
    const timers: ReturnType<typeof setTimeout>[] = [];

    const lock = (card: HTMLElement) => {
      // Buttons wrapping a rounded card (project cards) get the lock on the card itself
      const host =
        getComputedStyle(card).borderRadius === "0px" && card.firstElementChild instanceof HTMLElement ? card.firstElementChild : card;
      if (getComputedStyle(host).position === "static") {
        host.style.position = "relative";
        restore.push(host);
      }
      const overlay = document.createElement("div");
      overlay.className = "hk-lock";
      overlay.setAttribute("aria-hidden", "true");
      ["tl", "tr", "bl", "br"].forEach((c) => el("span", `hk-lc hk-lc-${c}`, overlay));
      el("span", "hk-lock-id", overlay).textContent = `TARGET 0x${hex((Math.random() * 0xffff) | 0)} ✓`;
      const arc = el("canvas", "hk-lock-arc", overlay) as HTMLCanvasElement;
      host.appendChild(overlay);
      locks.add(overlay);
      sfx.target();

      // An arc sparks along the card's top edge a few times as it locks
      const w = (arc.width = host.clientWidth);
      const h = (arc.height = host.clientHeight);
      const g = arc.getContext("2d");
      if (g) {
        [0, 70, 140, 210, 300].forEach((ms, i, all) =>
          timers.push(
            setTimeout(() => {
              g.clearRect(0, 0, w, h);
              if (i < all.length - 1) drawBolt(g, [10, 6], [w - 10, 6], 16, 0.9, false);
            }, ms)
          )
        );
      }
      timers.push(
        setTimeout(() => {
          overlay.remove();
          locks.delete(overlay);
        }, 1700)
      );
    };

    const io = new IntersectionObserver(
      (entries) => {
        // A row of cards entering together locks on one after another
        entries
          .filter((e) => e.isIntersecting)
          .forEach((e, i) => {
            io.unobserve(e.target);
            timers.push(setTimeout(() => lock(e.target as HTMLElement), i * 110));
          });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.2 }
    );

    const scan = () =>
      content.querySelectorAll<HTMLElement>(LOCK_CARDS).forEach((c) => {
        if (seen.has(c) || c.closest(LOCK_SKIP) || c.parentElement?.closest(LOCK_CARDS)) return;
        const pos = getComputedStyle(c).position;
        if (pos === "absolute" || pos === "fixed" || pos === "sticky") return;
        const r = c.getBoundingClientRect();
        if (r.width < 140 || r.height < 90) return;
        seen.add(c);
        io.observe(c);
      });

    // Cards added later (tabs, filters, "load more") get it too; our own overlays are ignored.
    let frame = 0;
    const observer = new MutationObserver((records) => {
      const added = records.some((r) =>
        Array.from(r.addedNodes).some((n) => n instanceof HTMLElement && !n.matches(".hk-lock, .hk-frame, .gen-scan, .btn-ripple-wrap"))
      );
      if (!added) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });

    let started = false;
    const go = () => {
      if (started) return;
      started = true;
      timers.push(
        setTimeout(() => {
          scan();
          observer.observe(content, { childList: true, subtree: true });
        }, 500)
      );
    };
    window.addEventListener("loader:done", go);
    timers.push(setTimeout(go, 2300));

    return () => {
      window.removeEventListener("loader:done", go);
      observer.disconnect();
      cancelAnimationFrame(frame);
      io.disconnect();
      timers.forEach(clearTimeout);
      locks.forEach((l) => l.remove());
      restore.forEach((c) => (c.style.position = ""));
    };
  }, [pathname]);

  /* ---------- screen: scanlines, scroll tear, address gutter ---------- */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const s = screen.current;
    if (!s) return;
    s.dataset.on = "true";

    let velocity = 0;
    let shown = 0;
    let lastY = -1;
    const lines = gutter.current ? Array.from(gutter.current.children) as HTMLElement[] : [];

    // Lightning across the screen while scrolling fast
    const canvas = arcs.current;
    const g = canvas?.getContext("2d") ?? null;
    const size = () => {
      if (!canvas) return;
      canvas.width = innerWidth;
      canvas.height = innerHeight;
    };
    size();
    window.addEventListener("resize", size);
    let glowing = 0; // frames left until the screen canvas is clear again
    let lastBolt = 0;
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        velocity = Math.max(velocity, Math.abs(self.getVelocity()));
      },
    });

    // "Jir-jir": every few seconds a short burst of electric interference flickers in front
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    let burstTimer: ReturnType<typeof setTimeout> | undefined;
    const spark = (x: number, y: number) => {
      if (!g) return;
      g.save();
      g.globalCompositeOperation = "lighter";
      g.fillStyle = "#dbeafe";
      g.shadowColor = "#3b82f6";
      g.shadowBlur = 8;
      for (let i = 0; i < 6; i++) {
        g.beginPath();
        g.arc(x + (Math.random() - 0.5) * 60, y + (Math.random() - 0.5) * 60, 0.6 + Math.random() * 1.6, 0, Math.PI * 2);
        g.fill();
      }
      g.restore();
    };
    const crawl = () => {
      if (!g || !canvas) return;
      const { width: w, height: h } = canvas;
      const len = 120 + Math.random() * 260;
      // Pick an edge and let an arc run along it, hugging the screen border
      const edges: [P, P][] = [
        [[Math.random() * w, 2], [0, 4]],
        [[Math.random() * w, h - 2], [0, h - 4]],
        [[2, Math.random() * h], [4, 0]],
        [[w - 2, Math.random() * h], [w - 4, 0]],
      ];
      const [from, axis] = edges[(Math.random() * 4) | 0];
      const to: P = axis[0] === 0 ? [from[0] + (Math.random() < 0.5 ? -len : len), axis[1]] : [axis[0], from[1] + (Math.random() < 0.5 ? -len : len)];
      drawBolt(g, from, to, 34, 0.9, true);
      spark(to[0], to[1]);
    };
    const streaks = (top: number, height: number) => {
      if (!g || !canvas) return;
      g.save();
      g.globalCompositeOperation = "lighter";
      g.shadowColor = "#3b82f6";
      g.shadowBlur = 6;
      for (let i = 0; i < 5 + Math.random() * 4; i++) {
        const y = top + Math.random() * height;
        const x = Math.random() * canvas.width * 0.8;
        g.strokeStyle = `rgba(147,197,253,${0.4 + Math.random() * 0.5})`;
        g.lineWidth = Math.random() < 0.3 ? 2 : 1;
        g.beginPath();
        g.moveTo(x, y);
        g.lineTo(x + 80 + Math.random() * 520, y);
        g.stroke();
      }
      g.restore();
    };
    const burst = () => {
      const b = band.current;
      if (!document.hidden && g && canvas && b) {
        const dur = 250 + Math.random() * 350;
        const end = performance.now() + dur;
        const top = Math.random() * canvas.height * 0.8;
        const height = canvas.height * (0.05 + Math.random() * 0.14);
        Object.assign(b.style, { top: `${top}px`, height: `${height}px` });
        s.dataset.burst = "true";
        sfx.zzt(dur / 1000);
        const frame = () => {
          if (performance.now() > end) {
            s.dataset.burst = "false";
            return;
          }
          b.style.transform = `translateX(${(Math.random() - 0.5) * 24}px) scaleY(${0.6 + Math.random() * 0.8})`;
          streaks(top, height);
          if (Math.random() < 0.6) crawl();
          glowing = 10; // the tick below fades it all out again
          burstTimer = setTimeout(frame, 40 + Math.random() * 30);
        };
        frame();
        burstTimer = setTimeout(burst, dur + (mobile ? 5000 : 2500) + Math.random() * 4000);
        return;
      }
      burstTimer = setTimeout(burst, 3000);
    };
    burstTimer = setTimeout(burst, 3500);

    const tick = () => {
      // The tear follows how fast you scroll, and fades out once you stop
      velocity *= 0.86;
      const target = Math.min(1, Math.max(0, (velocity - 600) / 3200));
      shown += (target - shown) * 0.25;
      if (Math.abs(shown - +(s.style.getPropertyValue("--hk-v") || 0)) > 0.01) {
        s.style.setProperty("--hk-v", shown.toFixed(3));
        sfx.setStatic(shown); // electric hum and crackle to go with the tear
      }

      if (g && canvas) {
        if (glowing > 0) {
          glowing--;
          if (glowing) fade(g, canvas.width, canvas.height, 0.3);
          else g.clearRect(0, 0, canvas.width, canvas.height);
        }
        const now = performance.now();
        if (shown > 0.3 && now - lastBolt > 90 && Math.random() < shown * 0.5) {
          lastBolt = now;
          glowing = 14;
          const y = Math.random() * canvas.height;
          drawBolt(g, [0, y], [canvas.width, y + (Math.random() - 0.5) * canvas.height * 0.4], 160, 0.5 + shown * 0.5, true);
        }
      }

      const y = Math.round(scrollY / 6);
      if (lines.length && y !== lastY) {
        lastY = y;
        lines.forEach((line, i) => {
          line.textContent = `0x${hex((y + i) * 16, 6)}  ${hex((Math.random() * 0xff) | 0, 2)} ${hex((Math.random() * 0xff) | 0, 2)}`;
        });
      }
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      trigger.kill();
      clearTimeout(burstTimer);
      s.dataset.burst = "false";
      window.removeEventListener("resize", size);
      if (g && canvas) g.clearRect(0, 0, canvas.width, canvas.height);
      s.dataset.on = "false";
    };
  }, []);

  return (
    <div ref={screen} data-on="false" aria-hidden className="hk-screen">
      <div className="hk-scanlines" />
      <div className="hk-tear" />
      <div ref={band} className="hk-static" />
      <canvas ref={arcs} className="hk-arcs" />
      <div ref={gutter} className="hk-gutter">
        {Array.from({ length: 14 }, (_, i) => (
          <span key={i} style={{ opacity: 1 - Math.abs(i - 6.5) / 8 }} />
        ))}
      </div>
    </div>
  );
}
