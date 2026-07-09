import { Metadata } from "next";
import AboutSection from "@/components/home/AboutSection";
import DoctorsSection from "@/components/home/DoctorsSection";
import Hero from "@/components/home/Hero";
import MetricsSection from "@/components/home/MetricsSection";
import ServicesSection from "@/components/home/ServicesSection";
import PatientPortalCTA from "@/components/home/PatientPortalCTA";

export const metadata: Metadata = {
  title: "Home",
  description: "Wasfa Diagnostic Centre offers modern diagnostic care built around precision, comfort, and clarity in Jhelum. Explore our lab tests and medical imaging services.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "name": "Wasfa Diagnostic Centre",
    "image": "https://www.wasfadiagnostic.app/logo.png",
    "@id": "https://www.wasfadiagnostic.app",
    "url": "https://www.wasfadiagnostic.app",
    "telephone": "+923467122225",
    "email": "wasfadiagnostic@yahoo.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Major Akram Shaheed Road, Azizabad",
      "addressLocality": "Jhelum",
      "addressRegion": "Punjab",
      "addressCountry": "PK"
    },
    "openingHoursSpecification": [{
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "08:00",
      "closes": "20:00"
    }]
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <MetricsSection />
      <AboutSection />
      <ServicesSection />
      <DoctorsSection />
      <PatientPortalCTA />
    </main>
  );
}
