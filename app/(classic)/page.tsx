import Hero from "@/components/classic/Hero";
import Highlights from "@/components/classic/Highlights";
import About from "@/components/classic/About";
import CertificatesSlider from "@/components/classic/CertificatesSlider";
import {
  QualificationPreview,
  ExperiencePreview,
  SkillsPreview,
  ProjectsPreview,
  ResearchPreview,
  CvContactPreview,
  ExploreMore,
} from "@/components/classic/HomePreviews";

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
      <Highlights />
      <CertificatesSlider />
      <CvContactPreview />
      <ExploreMore />
    </main>
  );
}
