"use client";

import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { PrimaryLink } from "@/components/ui/Section";

const values = [
  {
    title: "Precision",
    description: "Every sample is handled with care and every result is verified for accuracy.",
    icon: "🎯",
  },
  {
    title: "Compassion",
    description: "We understand that medical tests can be stressful — we make the experience easier.",
    icon: "💗",
  },
  {
    title: "Accessibility",
    description: "Online report access means your results are available whenever you need them.",
    icon: "🌐",
  },
  {
    title: "Trust",
    description: "Thousands of families in Jhelum rely on us for their diagnostic needs.",
    icon: "🤝",
  },
];

export function AboutContent() {
  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="mx-auto max-w-3xl text-center">
          <p className="text-lg leading-relaxed text-pink-700/85">
            WASFA Diagnostic Center is a full-service diagnostic facility located in Jhelum,
            Punjab. We offer a wide range of laboratory tests and imaging services, supported
            by modern equipment and a dedicated team of healthcare professionals.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-pink-700/85">
            Our mission is simple: deliver fast, accurate diagnostic results while treating
            every patient with the respect and care they deserve. With our secure online
            patient portal, accessing your reports has never been easier.
          </p>
        </RevealOnScroll>

        <RevealOnScroll className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-3xl border border-pink-100 bg-pink-50/30 p-6 text-center"
            >
              <p className="text-3xl">{v.icon}</p>
              <h3 className="mt-4 font-bold text-pink-900">{v.title}</h3>
              <p className="mt-2 text-sm text-pink-700/75">{v.description}</p>
            </div>
          ))}
        </RevealOnScroll>

        <RevealOnScroll className="mt-20 text-center">
          <h3 className="font-display text-2xl font-bold text-pink-900">
            Ready to access your reports?
          </h3>
          <p className="mt-3 text-pink-600">
            Sign in to the patient portal with your MRN and password.
          </p>
          <div className="mt-8">
            <PrimaryLink href="/portal">Go to Patient Portal</PrimaryLink>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
