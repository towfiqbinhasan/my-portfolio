import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import { Toaster } from "react-hot-toast";
export const metadata = {
  title: "Towfiq Bin Hasan | Portfolio",
  description: "CSE Student Portfolio - Web Developer, Researcher, and Content Creator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
       <PageLoader /> 
  <Navbar />
  <Toaster
    position="top-center"
    toastOptions={{
      style: {
        background: "#1a1a24",
        color: "#fff",
        border: "1px solid rgba(168, 85, 247, 0.3)",
      },
    }}
  />
  <div className="pt-20 min-h-screen">{children}</div>
  <Footer />
</body>
    </html>
  );
}