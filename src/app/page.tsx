import AboutSection from "@/components/home/AboutSection";
import DoctorsSection from "@/components/home/DoctorsSection";
import Hero from "@/components/home/Hero";
import ServicesSection from "@/components/home/ServicesSection";
import PatientPortalCTA from "@/components/home/PatientPortalCTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutSection />
      <ServicesSection />
      <DoctorsSection />
      <PatientPortalCTA />
    </main>
  );
}
