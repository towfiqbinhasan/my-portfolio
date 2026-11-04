"use client";
import dynamic from "next/dynamic";
import { usePublicPathname } from "@/lib/useSiteMode";

// three.js is only needed in the browser.
const World3D = dynamic(() => import("@/components/World3D"), { ssr: false });

/** Lighter 3D scroll flight behind every page except home (home mounts its own, see HomeWorld). */
export default function SiteWorld() {
  const pathname = usePublicPathname();
  if (pathname === "/") return null;
  // Keyed by route so each page starts its flight from the beginning.
  return <World3D key={pathname} variant="page" />;
}
