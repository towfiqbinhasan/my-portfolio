import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import ChatBot from "@/components/ChatBot";
import ResearchBackground from "@/components/ResearchBackground";
import ButtonEffects from "@/components/ButtonEffects";
import { Toaster } from "react-hot-toast";
import { Instrument_Serif, Outfit } from "next/font/google";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
});
const display = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
});
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