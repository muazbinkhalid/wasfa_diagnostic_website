"use client";

import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { services } from "@/lib/site-config";

const icons: Record<string, string> = {
  flask: "🧪",
  scan: "📡",
  xray: "🩻",
  heart: "❤️",
  baby: "👶",
  package: "📋",
};

export function ServicesGrid() {
  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
          {services.map((service) => (
            <article
              key={service.title}
              className="group rounded-3xl border border-pink-100 bg-gradient-to-br from-white to-pink-50/30 p-8 transition-all duration-500 hover:-translate-y-1 hover:border-pink-200 hover:shadow-xl hover:shadow-pink-200/30"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-100 text-3xl transition-transform group-hover:scale-110">
                {icons[service.icon] ?? "✨"}
              </div>
              <h3 className="text-xl font-bold text-pink-900">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-pink-700/75">
                {service.description}
              </p>
            </article>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
