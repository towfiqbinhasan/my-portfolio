"use client";
import dynamic from "next/dynamic";
import SectionRail from "@/components/SectionRail";

// three.js is only needed in the browser.
const World3D = dynamic(() => import("@/components/World3D"), { ssr: false });

/** Home: the full 3D story, mounted with the page so it can find the sections' stops. */
export default function HomeWorld() {
  return (
    <>
      <World3D variant="home" />
      <SectionRail />
    </>
  );
}
