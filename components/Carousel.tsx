"use client";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { motion, AnimatePresence, useMotionValue, useAnimationFrame, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Movement (px) that turns a press into a drag rather than a click.
const DRAG_THRESHOLD = 6;

/**
 * Endless marquee that eases to a stop on hover, can be dragged, and keeps
 * gliding with momentum after a flick. The loop width is measured from the
 * rendered cards, so it stays seamless at every breakpoint.
 *
 * Scrolling drives it too: the cards ride in on a 3D wave as the strip enters
 * (scrubbed, so it follows the scroll both ways), and a fast scroll flings the
 * strip forward and leans it in the direction of travel.
 *
 * Depth: the strip reads as a curved drum. The card in the middle faces you, full
 * size and bright; towards the edges cards turn away, sink back and dim.
 */
export function Carousel({
  count,
  renderCard,
  speed = 42,
  depth = "full",
}: {
  count: number;
  renderCard: (index: number, key: string) => ReactNode;
  speed?: number;
  /** "soft" for documents (certificates): a slight curve, barely dimmed, so the sheets stay readable. */
  depth?: "full" | "soft";
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  const loopWidth = useRef(0);
  const pressed = useRef(false);
  const dragging = useRef(false);
  const start = useRef(0);
  const suppressClick = useRef(false);
  const paused = useRef(false);
  const current = useRef(0); // px/sec the marquee is drifting at
  const momentum = useRef(0); // px/sec left over from a flick
  const boost = useRef(0); // px/sec pushed in by page scrolling
  const wrapRef = useRef<HTMLDivElement>(null);
  const last = useRef({ x: 0, t: 0 });
  const [copies, setCopies] = useState(3);

  const measure = useCallback(() => {
    const copy = copyRef.current;
    if (!copy) return;
    const width = copy.getBoundingClientRect().width;
    if (width > 0) {
      loopWidth.current = width;
      // Enough copies to cover the screen plus one full loop.
      setCopies(Math.max(2, Math.ceil((window.innerWidth + width) / width) + 1));
    }
  }, []);

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, count]);

  const wrap = (value: number) => {
    const w = loopWidth.current;
    if (!w) return value;
    let v = value % w;
    if (v > 0) v -= w;
    return v;
  };

  useAnimationFrame((_, delta) => {
    if (dragging.current || !loopWidth.current) return;
    const dt = Math.min(delta, 50) / 1000;
    const f = Math.min(delta / 16.7, 3);

    // Ease toward the target speed instead of stopping dead on hover.
    const target = paused.current || reduce ? 0 : speed;
    current.current += (target - current.current) * (1 - Math.pow(0.92, f));
    momentum.current *= Math.pow(0.93, f);
    if (Math.abs(momentum.current) < 1) momentum.current = 0;
    boost.current *= Math.pow(0.9, f);

    x.set(wrap(x.get() - current.current * dt + momentum.current * dt + boost.current * dt));
  });

  // Depth / coverflow: each card's turn, depth and dimming follow its distance from the
  // middle. Driven by the strip position itself, so it tracks drift, drags and flings alike.
  useLayoutEffect(() => {
    const wrapEl = wrapRef.current;
    const track = trackRef.current;
    if (!wrapEl || !track || reduce) return;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const soft = depth === "soft";
    const TURN = soft ? (mobile ? 4 : 7) : mobile ? 10 : 20;
    const DEPTH = soft ? (mobile ? 15 : 35) : mobile ? 40 : 110;
    const SHRINK = soft ? 0.03 : mobile ? 0.04 : 0.07;
    const DIM = soft ? 0.12 : 0.42;
    let flows: { el: HTMLElement; c: number; focus?: boolean }[] = [];
    let half = 1;
    // Card centres in the strip's own coordinates. Measured on the .carousel-item wrapper, whose
    // offsetParent is the (transformed) track; offsetLeft ignores transforms, so these hold still.
    const measureFlows = () => {
      half = wrapEl.clientWidth / 2;
      flows = Array.from(track.querySelectorAll<HTMLElement>(".carousel-flow")).map((el) => {
        const item = el.parentElement!;
        return { el, c: item.offsetLeft + item.offsetWidth / 2 };
      });
    };
    const apply = (vx: number) => {
      for (const f of flows) {
        const d = Math.max(-1.6, Math.min(1.6, (f.c + vx - half) / half));
        const ad = Math.abs(d);
        f.el.style.transform = `perspective(1100px) translateZ(${(-ad * DEPTH).toFixed(1)}px) rotateY(${(d * TURN).toFixed(2)}deg) scale(${(1 - ad * SHRINK).toFixed(3)})`;
        f.el.style.setProperty("--fd", Math.min(ad * 0.5, DIM).toFixed(3));
        // The card nearest the middle is "in focus": it gets a glowing frame
        const focus = ad < 0.2;
        if (focus !== f.focus) {
          f.focus = focus;
          f.el.classList.toggle("carousel-flow-focus", focus);
        }
      }
    };
    measureFlows();
    apply(x.get());
    const unsub = x.on("change", apply);
    const onResize = () => {
      measureFlows();
      apply(x.get());
    };
    window.addEventListener("resize", onResize);
    return () => {
      unsub();
      window.removeEventListener("resize", onResize);
    };
  }, [copies, count, reduce, x, depth]);

  // Scroll-driven entrance wave + scroll fling / lean
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || reduce) return;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    let settle = () => {};
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".carousel-item", el);
      const vw = window.innerWidth;
      gsap.fromTo(
        items,
        mobile
          ? { y: 70, opacity: 0, scale: 0.88 }
          : { y: 170, opacity: 0, scale: 0.8, rotationY: -30, rotationX: 16, transformPerspective: 1100 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationY: 0,
          rotationX: 0,
          ease: "power2.out",
          // The wave runs left to right across the screen; cards still off to the right finish last.
          stagger: (_, target: HTMLElement) => gsap.utils.clamp(0, 1, target.getBoundingClientRect().left / vw) * 0.6,
          scrollTrigger: { trigger: el, start: "top 100%", end: mobile ? "top 85%" : "top 78%", scrub: 0.8 },
        }
      );

      const lean = gsap.quickTo(el, "skewX", { duration: 0.6, ease: "power3.out" });
      const maxLean = mobile ? 3 : 6;
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity(); // px/sec, positive when scrolling down
          boost.current = gsap.utils.clamp(-1600, 1600, -v * 0.35);
          lean(gsap.utils.clamp(-maxLean, maxLean, -v / 280));
        },
        onLeave: () => lean(0),
        onLeaveBack: () => lean(0),
      });
      // Settle upright once scrolling stops.
      settle = () => lean(0);
      ScrollTrigger.addEventListener("scrollEnd", settle);
    }, el);
    return () => {
      ScrollTrigger.removeEventListener("scrollEnd", settle);
      ctx.revert();
    };
  }, [reduce, copies]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    pressed.current = true;
    dragging.current = false;
    momentum.current = 0;
    start.current = e.clientX;
    last.current = { x: e.clientX, t: performance.now() };
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!pressed.current) return;

    // Capture the pointer only once this is clearly a drag, otherwise the
    // pointerup would retarget and the card underneath would never get its click.
    if (!dragging.current) {
      if (Math.abs(e.clientX - start.current) < DRAG_THRESHOLD) return;
      dragging.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      last.current = { x: e.clientX, t: performance.now() };
      return;
    }

    const now = performance.now();
    const dx = e.clientX - last.current.x;
    const dt = Math.max(now - last.current.t, 1);
    last.current = { x: e.clientX, t: now };
    momentum.current = (dx / dt) * 1000;
    x.set(wrap(x.get() + dx));
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") paused.current = false;
    pressed.current = false;
    if (!dragging.current) return;
    dragging.current = false;
    // Swallow the click that follows a drag so it doesn't open a card.
    suppressClick.current = true;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const onClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    if (!suppressClick.current) return;
    suppressClick.current = false;
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      ref={wrapRef}
      className="carousel-mask relative w-full"
      // Only a real cursor pauses the drift — on touch there is no reliable leave event.
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") paused.current = true;
      }}
      onPointerLeave={() => (paused.current = false)}
    >
      <motion.div
        ref={trackRef}
        className="flex cursor-grab touch-pan-y select-none active:cursor-grabbing"
        style={{ x }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
      >
        {Array.from({ length: copies }).map((_, copy) => (
          <div
            key={copy}
            ref={copy === 0 ? copyRef : undefined}
            aria-hidden={copy > 0}
            className="flex flex-shrink-0 gap-5 pr-5"
          >
            {Array.from({ length: count }).map((__, i) => (
              <div key={`${copy}-${i}`} className="carousel-item flex flex-shrink-0">
                {/* Separate layer for the depth effect, so it never fights the entrance tween */}
                <div className="carousel-flow flex">{renderCard(i, `${copy}-${i}`)}</div>
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/** Modal with a soft spring, Escape to close and the page scroll locked. */
export function Lightbox({
  open,
  onClose,
  onPrev,
  onNext,
  position,
  contentKey,
  wide = false,
  children,
}: {
  open: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  position?: string;
  contentKey?: string | number;
  /** Roomier panel for galleries and long write-ups. */
  wide?: boolean;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 px-3 py-6 sm:px-6 sm:py-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16, transition: { duration: 0.22, ease: "easeIn" } }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className={`modal-rim relative my-auto w-full ${wide ? "max-w-4xl" : "max-w-2xl"} overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0c162c] shadow-2xl shadow-black/70`}
          >
            <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />
            <button
              onClick={onClose}
              aria-label="Close"
              className="btn-press absolute right-3 top-3 sm:right-4 sm:top-4 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/60 text-lg sm:text-xl text-white/80 ring-1 ring-white/10 backdrop-blur transition hover:bg-sky-500/60 hover:text-white"
            >
              <FiX />
            </button>

            {onPrev && (
              <button
                onClick={onPrev}
                aria-label="Previous"
                className="btn-press absolute left-2 sm:left-3 top-1/2 z-20 flex h-9 w-9 sm:h-11 sm:w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-lg sm:text-xl text-white/80 ring-1 ring-white/10 backdrop-blur transition hover:bg-sky-500/60 hover:text-white"
              >
                <FiChevronLeft />
              </button>
            )}
            {onNext && (
              <button
                onClick={onNext}
                aria-label="Next"
                className="btn-press absolute right-2 sm:right-3 top-1/2 z-20 flex h-9 w-9 sm:h-11 sm:w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-lg sm:text-xl text-white/80 ring-1 ring-white/10 backdrop-blur transition hover:bg-sky-500/60 hover:text-white"
              >
                <FiChevronRight />
              </button>
            )}
            {position && (
              <span className="absolute left-3 top-3 sm:left-4 sm:top-4 z-20 rounded-full bg-black/60 px-2.5 py-1 text-[11px] sm:text-xs text-white/70 ring-1 ring-white/10 backdrop-blur">
                {position}
              </span>
            )}

            {/* Keyed so stepping to another item replays the reveal and resets the scroll */}
            <div key={contentKey} data-lenis-prevent className="modal-scroll max-h-[88vh] sm:max-h-[85vh] overflow-y-auto overscroll-contain">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Staggered reveal for the blocks inside a lightbox. */
/**
 * Soft entrance for a block inside a modal. Blocks already on screen drift up one after
 * another as it opens; the rest float up out of a light blur as you scroll the modal to
 * them (the in-view check respects the modal's own scroll area). The stagger is capped so
 * nothing far down the list waits long.
 */
export const lightboxItem = (i: number) => ({
  initial: { opacity: 0, y: 18, filter: "blur(4px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.6, delay: 0.1 + Math.min(i, 5) * 0.06, ease: [0.22, 1, 0.36, 1] as const },
});

/**
 * Image gallery for a modal: one large frame with swipe + arrows, a compact
 * counter and a thumbnail strip — instead of a long row of tiny dots.
 */
export function ModalGallery({
  images,
  alt,
  fit = "cover",
  className = "",
}: {
  images: string[];
  alt: string;
  fit?: "cover" | "contain";
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const stripRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (delta: number) => {
      setDir(delta);
      setIndex((i) => (i + delta + images.length) % images.length);
    },
    [images.length]
  );

  // Arrow keys while the gallery is on screen
  useEffect(() => {
    if (images.length < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, images.length]);

  // Keep the active thumbnail in view. Only the strip scrolls sideways: scrollIntoView would
  // also scroll the popup (and the page) to bring the strip itself back on screen.
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = strip?.querySelector<HTMLElement>(`[data-i="${index}"]`);
    if (!strip || !thumb) return;
    const offset = thumb.getBoundingClientRect().left - strip.getBoundingClientRect().left;
    strip.scrollTo({ left: strip.scrollLeft + offset - (strip.clientWidth - thumb.offsetWidth) / 2, behavior: "smooth" });
  }, [index]);

  if (images.length === 0) return null;

  return (
    <div className={className}>
      <div className="group relative h-[46vh] max-h-[560px] min-h-[240px] w-full overflow-hidden bg-[#050b1a] sm:h-[54vh] md:h-[60vh]">
        {/* Blurred copy of the same shot fills the frame, so a portrait photo
            never sits on an empty black box — the photo itself is never cropped. */}
        <Image
          key={`bg-${index}`}
          src={images[index]}
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="scale-110 object-cover opacity-25 blur-2xl"
        />
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={index}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40, scale: 1.02 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            drag={images.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(1);
              else if (info.offset.x > 60) go(-1);
            }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <Image
              src={images[index]}
              alt={`${alt} — image ${index + 1}`}
              fill
              sizes="(min-width: 1024px) 900px, 100vw"
              className={`object-contain ${fit === "cover" ? "p-0" : "p-3"}`}
              draggable={false}
              priority={index === 0}
            />
          </motion.div>
        </AnimatePresence>

        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0c162c] to-transparent" />

        {images.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="btn-press absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white/80 opacity-0 ring-1 ring-white/10 backdrop-blur transition hover:bg-sky-500/70 hover:text-white focus-visible:opacity-100 group-hover:opacity-100"
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next image"
              className="btn-press absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white/80 opacity-0 ring-1 ring-white/10 backdrop-blur transition hover:bg-sky-500/70 hover:text-white focus-visible:opacity-100 group-hover:opacity-100"
            >
              <FiChevronRight />
            </button>
            <span className="absolute bottom-3 right-3 z-10 rounded-full bg-black/70 px-2.5 py-1 font-mono text-[11px] text-white/80 ring-1 ring-white/10 backdrop-blur">
              {index + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div ref={stripRef} className="modal-scroll flex gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          {images.map((src, i) => (
            <button
              key={src + i}
              data-i={i}
              onClick={() => {
                setDir(i > index ? 1 : -1);
                setIndex(i);
              }}
              aria-label={`Image ${i + 1}`}
              className={`btn-press relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg ring-1 sm:h-14 sm:w-20 ${
                i === index
                  ? "ring-2 ring-sky-400 brightness-110"
                  : "opacity-55 ring-white/10 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
