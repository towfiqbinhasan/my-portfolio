"use client";
import { usePathname } from "next/navigation";
import { ANIMATED_PREFIX, MODE_COOKIE, MODE_MAX_AGE, type SiteMode } from "@/lib/siteMode";

/** Switch modes: remember the choice for a year, then reload into the other design. */
export function setSiteMode(mode: SiteMode) {
  document.cookie = `${MODE_COOKIE}=${mode}; path=/; max-age=${MODE_MAX_AGE}; samesite=lax`;
  window.location.reload();
}

/**
 * usePathname() for the animated pages. Prerendered HTML knows the internal path
 * (/animated/projects) while the browser shows the public one (/projects); stripping the
 * prefix makes both agree, so there's no hydration mismatch and comparisons like
 * pathname === "/" keep working.
 */
export function usePublicPathname() {
  const pathname = usePathname();
  if (pathname === ANIMATED_PREFIX) return "/";
  return pathname.startsWith(`${ANIMATED_PREFIX}/`) ? pathname.slice(ANIMATED_PREFIX.length) : pathname;
}
