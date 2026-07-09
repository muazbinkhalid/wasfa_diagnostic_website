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
  metadataBase: new URL("https://www.wasfadiagnostic.app"),
  title: {
    default: "Wasfa Diagnostic Centre | Precision & Clarity",
    template: "%s | Wasfa Diagnostic Centre",
  },
  description: "Modern diagnostic care built around precision, comfort, and clarity in Jhelum. Offering advanced lab tests, MRIs, and medical imaging with secure patient portal.",
  keywords: ["diagnostic centre jhelum", "lab tests", "medical imaging", "MRI", "blood tests", "wasfa diagnostics", "health portal"],
  openGraph: {
    title: "Wasfa Diagnostic Centre | Precision & Clarity",
    description: "Modern diagnostic care built around precision, comfort, and clarity in Jhelum.",
    url: "https://www.wasfadiagnostic.app",
    siteName: "Wasfa Diagnostic Centre",
    locale: "en_PK",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sansFont.variable} ${urduFont.variable}`}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
