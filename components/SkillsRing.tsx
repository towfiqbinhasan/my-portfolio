"use client";
import { useEffect, useRef } from "react";
import type { IconType } from "react-icons";
import { LuBrainCircuit, LuChartColumn, LuCloud, LuCode, LuDatabase, LuNetwork } from "react-icons/lu";
import { gsap, MQ } from "@/lib/gsap";

// Same focus areas the hero lists, one card each.
const CARDS: { icon: IconType; title: string; text: string }[] = [
  { icon: LuCode, title: "Full Stack Web", text: "Laravel • Next.js • React" },
  { icon: LuDatabase, title: "Database & Cache", text: "MySQL • Redis" },
  { icon: LuCloud, title: "Deployment", text: "Docker • Dokploy" },
  { icon: LuBrainCircuit, title: "Machine Learning", text: "Python • Scikit-learn" },
  { icon: LuChartColumn, title: "Data Science", text: "Pandas • NumPy" },
  { icon: LuNetwork, title: "Deep Learning", text: "TensorFlow • PyTorch" },
];

const STEP = 360 / CARDS.length;

function Card({ icon: Icon, title, text, index }: (typeof CARDS)[number] & { index: number }) {
  return (
    <div className="relative h-full overflow-hidden border border-white/10 bg-[#121214]/90 p-6 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]">
      <span className="absolute right-4 top-3 font-[family-name:var(--font-heading)] text-4xl text-white/[0.06]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="flex h-12 w-12 items-center justify-center border border-sky-500/40 bg-sky-500/10 text-2xl text-sky-400">
        <Icon />
      </span>
      <h3 className="mt-6 font-[family-name:var(--font-heading)] text-2xl uppercase tracking-wide text-white">{title}</h3>
      <p className="mt-2 text-sm text-gray-400">{text}</p>
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-sky-500" />
    </div>
  );
}

/**
 * Desktop: the cards sit on a 3D ring; the section pins and scroll turns the
 * ring, so each card takes the front in turn (scaled up, sharp, glowing) while
 * the rest dim and blur. Mobile / reduced motion: a plain stack of cards.
 */
export default function SkillsRing() {
  const stage = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia(stage);

    mm.add(MQ.desktop, () => {
      const cards = gsap.utils.toArray<HTMLElement>(".ring-card", ring.current);
      const state = { rot: 0 };

      // Ring radius: wide enough that neighbouring cards don't overlap.
      const radius = () => (window.innerWidth >= 1024 ? 360 : 330);
      let r = radius();

      // Front-facing card: full size and opacity, glow; the rest fall back.
      // (Written as a raw transform: the ring needs rotateY *then* translateZ.)
      const paint = () => {
        cards.forEach((card, i) => {
          const a = gsap.utils.wrap(-180, 180, i * STEP + state.rot);
          const front = 1 - Math.min(Math.abs(a) / (STEP * 1.5), 1); // 1 at front, 0 a card and a half away
          card.style.transform = `rotateY(${i * STEP}deg) translateZ(${r}px) scale(${0.8 + front * 0.15})`;
          card.style.opacity = String(0.25 + front * 0.75);
          card.style.filter = front > 0.98 ? "none" : `blur(${(1 - front) * 4}px)`;
          card.style.zIndex = String(Math.round(front * 10));
          card.classList.toggle("ring-card-front", front > 0.8);
        });
        gsap.set(ring.current, { rotationY: state.rot });
      };
      const onResize = () => {
        r = radius();
        paint();
      };
      window.addEventListener("resize", onResize);
      paint();

      gsap.to(state, {
        rot: -STEP * (CARDS.length - 1),
        ease: "none",
        onUpdate: paint,
        scrollTrigger: {
          trigger: stage.current,
          start: "center center",
          end: () => `+=${window.innerHeight * 2.2}`,
          pin: true,
          scrub: 1,
          snap: { snapTo: 1 / (CARDS.length - 1), duration: { min: 0.2, max: 0.6 }, ease: "power3.out" },
          invalidateOnRefresh: true,
        },
      });

      return () => {
        window.removeEventListener("resize", onResize);
        cards.forEach((card) => card.removeAttribute("style"));
      };
    });

    mm.add(MQ.mobile, () => {
      gsap.utils.toArray<HTMLElement>(".stack-card", stage.current).forEach((card, i) => {
        gsap.from(card, {
          y: 60,
          rotation: i % 2 ? 5 : -5,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={stage} className="relative">
      {/* 3D ring (desktop with motion) */}
      <div data-cursor="Scroll" className="relative hidden h-[460px] items-center justify-center [perspective:2200px] md:flex motion-reduce:md:hidden">
        <div aria-hidden className="absolute h-72 w-[38rem] rounded-full bg-sky-500/15 blur-[90px]" />
        <div ref={ring} className="relative h-[250px] w-[250px] [transform-style:preserve-3d]">
          {CARDS.map((c, i) => (
            <div key={c.title} className="ring-card absolute inset-0 [backface-visibility:hidden]">
              <Card {...c} index={i} />
            </div>
          ))}
        </div>
      </div>

      {/* Stacked cards (phones, or reduced motion) */}
      <div className="grid gap-4 sm:grid-cols-2 md:hidden motion-reduce:md:grid motion-reduce:md:grid-cols-3">
        {CARDS.map((c, i) => (
          <div key={c.title} className="stack-card">
            <Card {...c} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
