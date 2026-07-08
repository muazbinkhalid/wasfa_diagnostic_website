import type { Metadata } from "next";
import { PageHero } from "@/components/ui/Section";
import { ContactContent } from "@/components/contact/ContactContent";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with WASFA Diagnostic Center in Jhelum.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        badge="Contact"
        title="We'd love to hear from you"
        subtitle="Visit us, call, or reach out — we're here to help with all your diagnostic needs."
      />
      <ContactContent />
    </>
  );
}
