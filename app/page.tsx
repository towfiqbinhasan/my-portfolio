import Hero from "@/components/Hero";
import Highlights from "@/components/Highlights";
import About from "@/components/About";
import CertificatesSlider from "@/components/CertificatesSlider";
export default function Home() {
  return (
    <main>
      <Hero />
      
      <About />
      <Highlights />
       <CertificatesSlider />
    </main>
  );
}