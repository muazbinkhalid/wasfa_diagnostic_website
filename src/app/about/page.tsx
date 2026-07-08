import type { Metadata } from "next";
import { PageHero } from "@/components/ui/Section";
import { AboutContent } from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about WASFA Diagnostic Center — trusted diagnostics in Jhelum.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        badge="About Us"
        title="Caring for Jhelum's health since day one"
        subtitle="We believe every patient deserves accurate results, clear communication, and a warm welcome."
      />
      <AboutContent />
    </>
  );
}
