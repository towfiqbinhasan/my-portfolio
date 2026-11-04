import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import ChatBot from "@/components/ChatBot";
import ResearchBackground from "@/components/ResearchBackground";
import ButtonEffects from "@/components/ButtonEffects";
import MotionLayer from "@/components/MotionLayer";
import TextReveal from "@/components/TextReveal";
import SiteWorld from "@/components/SiteWorld";
import { Toaster } from "react-hot-toast";
import { serif, display, heading, body, script } from "@/lib/fonts";

export const metadata = {
  title: "Towfiq Bin Hasan",
  description: "CS Student Portfolio - Web Developer, Researcher, and ML Engineer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${display.variable} ${heading.variable} ${body.variable} ${script.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
       <PageLoader /> 
       <ResearchBackground />
       <ChatBot />
       <ButtonEffects />
       <MotionLayer />
       <TextReveal />
       <SiteWorld />
  <Navbar />
  <Toaster
    position="top-center"
    toastOptions={{
      style: {
        background: "#0d182e",
        color: "#fff",
        border: "1px solid rgba(47,123,255, 0.3)",
        borderRadius: "4px",
      },
    }}
  />
  <div id="page-content" className="pt-20 min-h-screen">{children}</div>
  <Footer />
</body>
    </html>
  );
}