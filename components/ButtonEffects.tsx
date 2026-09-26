"use client";
import { useEffect } from "react";

/** Button-like elements that get a click ripple. Plain text links are left alone. */
const TARGETS = "button, [role='button'], .btn-press, .btn-shine";

/**
 * Site-wide click ripple: a soft light circle spreads from where a button was pressed.
 * Mounted once in the root layout; opt an element out with `data-no-ripple`.
 */
export default function ButtonEffects() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function onPointerDown(e: PointerEvent) {
      const el = (e.target as Element | null)?.closest<HTMLElement>(TARGETS);
      if (!el || el.closest("[data-no-ripple]") || (el as HTMLButtonElement).disabled) return;

      if (getComputedStyle(el).position === "static") el.style.position = "relative";

      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2.2;
      const wrap = document.createElement("span");
      wrap.className = "btn-ripple-wrap";
      wrap.setAttribute("aria-hidden", "true");
      const ripple = document.createElement("span");
      ripple.className = "btn-ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      wrap.appendChild(ripple);
      el.appendChild(wrap);
      ripple.addEventListener("animationend", () => wrap.remove(), { once: true });
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return null;
}
