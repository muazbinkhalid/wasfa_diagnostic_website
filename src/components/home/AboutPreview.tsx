"use client";

import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { SectionHeading } from "@/components/ui/Section";
import { PrimaryLink } from "@/components/ui/Section";

export function AboutPreview() {
  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <RevealOnScroll>
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-[2rem] bg-gradient-to-br from-pink-100 to-pink-200/60 shadow-2xl shadow-pink-200/40">
                <div className="flex h-full flex-col items-center justify-center p-10 text-center">
                  <p className="font-display text-6xl font-bold text-pink-300/60">W</p>
                  <p className="mt-4 font-display text-2xl font-bold text-pink-800">
                    WASFA Diagnostic Center
                  </p>
                  <p className="mt-2 text-pink-600">Serving Jhelum with excellence</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 rounded-2xl glass px-6 py-4 shadow-xl">
                <p className="text-3xl font-bold text-pink-600">15+</p>
                <p className="text-xs font-medium text-pink-500">Years of Trust</p>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll y={40}>
            <SectionHeading
              eyebrow="About Us"
              title="Diagnostics you can depend on"
              description="At WASFA Diagnostic Center, we combine modern equipment with a patient-first approach. Every test is handled with precision, and every report is delivered with the clarity you deserve."
              align="left"
            />
            <p className="mb-8 text-pink-700/80">
              Our team of skilled technicians and caring staff work together to make your
              diagnostic experience smooth, comfortable, and stress-free — whether you&apos;re
              visiting for a routine check-up or specialized testing.
            </p>
            <PrimaryLink href="/about">Learn more about us</PrimaryLink>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
