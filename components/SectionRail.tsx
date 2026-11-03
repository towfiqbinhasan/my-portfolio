"use client";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";

const LABELS: Record<string, string> = {
  hero: "Intro",
  about: "About",
  qualification: "Education",
  experience: "Experience",
  skills: "Skills",
  projects: "Projects",
  research: "Research",
  contact: "Contact",
};

type Lenis = { scrollTo: (target: HTMLElement, opts?: { offset?: number; duration?: number }) => void };

/** Side scroll indicator: a filling line with the section names; click one to jump there. */
export default function SectionRail() {
  const [sections, setSections] = useState<{ id: string; el: HTMLElement }[]>([]);
  const [active, setActive] = useState(0);
  const fill = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const found = Array.from(document.querySelectorAll<HTMLElement>("[data-world]"))
      .filter((el) => el.dataset.world! in LABELS)
      .map((el) => ({ id: el.dataset.world!, el }));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the sections only exist in the DOM after mount
    setSections(found);

    const triggers = found.map(({ el }, i) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        refreshPriority: -1, // after the pinned sections, so their spacing is counted
        onToggle: (self) => self.isActive && setActive(i),
      })
    );
    const progress = ScrollTrigger.create({
      start: 0,
      end: "max",
      refreshPriority: -1,
      onUpdate: (self) => {
        if (fill.current) fill.current.style.transform = `scaleY(${self.progress})`;
      },
    });
    return () => {
      triggers.forEach((t) => t.kill());
      progress.kill();
    };
  }, []);

  const go = (el: HTMLElement) => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.6 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  if (!sections.length) return null;

  return (
    <nav aria-label="Page sections" className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <div className="relative flex flex-col gap-4 pr-4">
        <span aria-hidden className="absolute bottom-1 right-0 top-1 w-px bg-white/10" />
        <span ref={fill} aria-hidden className="absolute bottom-1 right-0 top-1 w-px origin-top scale-y-0 bg-sky-500" />
        {sections.map(({ id, el }, i) => (
          <button
            key={id}
            type="button"
            onClick={() => go(el)}
            className={`group flex items-center justify-end gap-3 text-[10px] uppercase tracking-[0.25em] transition-colors duration-300 ${
              i === active ? "text-white" : "text-white/35 hover:text-white/80"
            }`}
          >
            <span className={`transition-opacity duration-300 ${i === active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
              {LABELS[id]}
            </span>
            <span
              className={`h-1.5 w-1.5 rotate-45 transition-all duration-300 ${
                i === active ? "scale-150 bg-sky-500 shadow-[0_0_10px_rgba(225,29,46,0.9)]" : "bg-white/30"
              }`}
            />
          </button>
        ))}
      </div>
    </nav>
  );
}
