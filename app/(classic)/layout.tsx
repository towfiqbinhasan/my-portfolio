import "./globals.css";
import Navbar from "@/components/classic/Navbar";
import Footer from "@/components/classic/Footer";
import PageLoader from "@/components/classic/PageLoader";
import ChatBot from "@/components/classic/ChatBot";
import ResearchBackground from "@/components/classic/ResearchBackground";
import ButtonEffects from "@/components/ButtonEffects";
import { Toaster } from "react-hot-toast";
import { serif, display } from "@/lib/fonts";

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
    <html lang="en" className={`${serif.variable} ${display.variable}`} data-scroll-behavior="smooth">
      <body>
       <PageLoader /> 
       <ResearchBackground />
       <ChatBot />
       <ButtonEffects />
  <Navbar />
  <Toaster
    position="top-center"
    toastOptions={{
      style: {
        background: "#0c1d3d",
        color: "#fff",
        border: "1px solid rgba(14, 165, 233, 0.3)",
      },
    }}
  />
  <div className="pt-20 min-h-screen">{children}</div>
  <Footer />
</body>
    </html>
  );
}