import { Instrument_Serif, Outfit, Anton, Inter, Caveat } from "next/font/google";

// Declared once and shared by both root layouts (classic + animated): Turbopack rejects the
// same Google font being set up in two places.
export const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
});
export const display = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
});
// Animated design only
export const heading = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
});
export const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});
export const script = Caveat({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-script",
});
