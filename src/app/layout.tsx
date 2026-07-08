import type { Metadata } from "next";
import { Noto_Nastaliq_Urdu, Outfit } from "next/font/google";
import "./globals.css";

const urduFont = Noto_Nastaliq_Urdu({
  variable: "--font-urdu",
  subsets: ["arabic"],
  weight: ["600", "700"],
  display: "swap",
});

const sansFont = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wasfa Diagnostic Centre",
  description: "Clarity in diagnosis. Confidence in care.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sansFont.variable} ${urduFont.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
