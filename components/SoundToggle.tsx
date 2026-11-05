"use client";
import { useEffect, useSyncExternalStore } from "react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { isSoundOn, setSound, sfx, subscribeSound, wakeSound } from "@/lib/sfx";
import { usePublicPathname } from "@/lib/useSiteMode";

const HOVERABLE = "a[href], button, [role='button']";
const NAME = "[data-sfx='name']";

/**
 * Animation mode's sound switch (navbar, next to the style switch). Off by default.
 * It also gives buttons and links a soft hover blip and a press click while sound is on;
 * the section, text and scroll sounds are fired by HackLayer and GenerateLayer.
 * Each page has its own sound theme (see lib/sfx); opening a page plays its signature.
 * The name (navbar brand, hero heading) glitches blue and gets its own shimmer on hover / tap.
 */
export default function SoundToggle({ className = "" }: { className?: string }) {
  const on = useSyncExternalStore(subscribeSound, isSoundOn, () => false);
  const pathname = usePublicPathname();

  useEffect(() => sfx.page(pathname), [pathname]);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let hovered: Element | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const name = (el: Element) => {
      sfx.name();
      if (still) return;
      el.classList.remove("hk-glitch");
      void (el as HTMLElement).offsetWidth; // restart the animation
      el.classList.add("hk-glitch");
      clearTimeout(timer);
      timer = setTimeout(() => el.classList.remove("hk-glitch"), 650);
    };
    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const el = target?.closest(NAME) ?? target?.closest(HOVERABLE) ?? null;
      if (el && el !== hovered) {
        if (el.matches(NAME)) name(el);
        else sfx.hover();
      }
      hovered = el;
    };
    const onDown = (e: PointerEvent) => {
      wakeSound(); // sound left on from last visit can only start after a gesture
      const target = e.target as Element | null;
      const named = target?.closest(NAME);
      if (named) name(named);
      else if (target?.closest(HOVERABLE)) sfx.click();
    };
    if (fine) document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", wakeSound);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", wakeSound);
      clearTimeout(timer);
    };
  }, []);

  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      title={on ? "Sound on" : "Sound off"}
      onClick={() => setSound(!on)}
      className={`relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border text-base transition-colors duration-300 ${
        on
          ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-300 shadow-[0_0_14px_-4px_rgba(56,189,248,0.8)]"
          : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
      } ${className}`}
    >
      {on ? <FiVolume2 /> : <FiVolumeX />}
      {on && <span aria-hidden className="sfx-wave" />}
    </button>
  );
}
