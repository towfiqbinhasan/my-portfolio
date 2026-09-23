import Hero from "@/components/Hero";
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
      <Hero />
      <About />
      <QualificationPreview />
      <ExperiencePreview />
      <SkillsPreview />
      <ProjectsPreview />
      <ResearchPreview />
      <CertificatesSlider />
      <Highlights />
      <CvContactPreview />
      <ExploreMore />
    </main>
  );
}
