"use client";
import { FiLayout } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import { setSiteMode } from "@/lib/useSiteMode";
import type { SiteMode } from "@/lib/siteMode";

const OPTIONS: { mode: SiteMode; label: string; icon: typeof FiLayout }[] = [
  { mode: "classic", label: "Normal", icon: FiLayout },
  { mode: "animated", label: "Animation", icon: HiSparkles },
];

/**
 * Normal | Animation switch in the navbar. Each design renders it with its own mode as
 * `current`; picking the other one saves the choice and reloads into that design.
 */
export default function ModeToggle({ current, className = "" }: { current: SiteMode; className?: string }) {
  return (
    <div
      role="group"
      aria-label="Site style"
      className={`flex flex-shrink-0 items-center gap-0.5 rounded-full border border-white/10 bg-white/5 p-0.5 text-xs font-medium ${className}`}
    >
      {OPTIONS.map(({ mode, label, icon: Icon }) => {
        const active = mode === current;
        return (
          <button
            key={mode}
            type="button"
            aria-pressed={active}
            title={active ? `${label} style (current)` : `Switch to ${label} style`}
            onClick={() => !active && setSiteMode(mode)}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 transition-colors duration-300 ${
              active
                ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-[0_0_14px_-4px_rgba(56,189,248,0.8)]"
                : "text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="text-sm" />
            <span className="hidden xl:inline">{label}</span>
            <span className="sr-only xl:hidden">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
