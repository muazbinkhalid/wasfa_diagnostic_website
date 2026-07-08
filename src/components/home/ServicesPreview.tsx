"use client";

import Link from "next/link";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { SectionHeading } from "@/components/ui/Section";
import { services } from "@/lib/site-config";

const icons: Record<string, string> = {
  flask: "🧪",
  scan: "📡",
  xray: "🩻",
  heart: "❤️",
  baby: "👶",
  package: "📋",
};

export function ServicesPreview() {
  const preview = services.slice(0, 3);

  return (
    <section className="section-padding relative bg-white">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="What We Offer"
          title="Comprehensive Diagnostic Services"
          description="From routine blood work to advanced imaging, we deliver accurate results with care you can trust."
        />

        <RevealOnScroll className="grid gap-6 md:grid-cols-3" stagger={0.15}>
          {preview.map((service) => (
            <article
              key={service.title}
              className="group relative overflow-hidden rounded-3xl border border-pink-100 bg-gradient-to-br from-white to-pink-50/50 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-pink-200 hover:shadow-xl hover:shadow-pink-200/40"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-2xl transition-transform duration-300 group-hover:scale-110">
                {icons[service.icon] ?? "✨"}
              </div>
              <h3 className="text-xl font-bold text-pink-900">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-pink-700/75">
                {service.description}
              </p>
              <div className="mt-6 h-1 w-0 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 transition-all duration-500 group-hover:w-16" />
            </article>
          ))}
        </RevealOnScroll>

        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-pink-600 transition-colors hover:text-pink-500"
          >
            View all services →
          </Link>
        </div>
      </div>
    </section>
  );
}
