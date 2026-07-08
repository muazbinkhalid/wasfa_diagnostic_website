import type { Metadata } from "next";
import { PageHero } from "@/components/ui/Section";
import { ServicesGrid } from "@/components/services/ServicesGrid";

export const metadata: Metadata = {
  title: "Services",
  description: "Comprehensive diagnostic services at WASFA Diagnostic Center in Jhelum.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        badge="Our Services"
        title="Everything you need for accurate diagnosis"
        subtitle="Modern equipment, skilled professionals, and fast turnaround — all under one roof."
      />
      <ServicesGrid />
    </>
  );
}
