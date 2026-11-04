import Hero from "@/components/Hero";
import HomeWorld from "@/components/HomeWorld";
import Highlights from "@/components/Highlights";
import About from "@/components/About";
import CertificatesSlider from "@/components/CertificatesSlider";
import {
  QualificationPreview,
  ExperiencePreview,
  SkillsPreview,
  ProjectsPreview,
  ResearchPreview,
  CvContactPreview,
  ExploreMore,
} from "@/components/HomePreviews";

export default function Home() {
  return (
    <main>
      <HomeWorld />
      <Hero />
      <About />
      <QualificationPreview />
      <ExperiencePreview />
      <SkillsPreview />
      <ProjectsPreview />
      <ResearchPreview />
      <Highlights />
      <CertificatesSlider />
      <CvContactPreview />
      <ExploreMore />
    </main>
  );
}
