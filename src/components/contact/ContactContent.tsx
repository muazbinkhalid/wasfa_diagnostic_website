"use client";

import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { siteConfig } from "@/lib/site-config";
import { PrimaryLink } from "@/components/ui/Section";

const contactItems = [
  { label: "Location", value: siteConfig.location, icon: "📍" },
  { label: "Phone", value: siteConfig.phone, href: `tel:${siteConfig.phone}`, icon: "📞" },
  { label: "Mobile", value: siteConfig.mobile, href: `tel:${siteConfig.mobile}`, icon: "📱" },
  { label: "Hours", value: siteConfig.hours, icon: "🕐" },
];

export function ContactContent() {
  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2">
          <RevealOnScroll>
            <div className="space-y-4">
              {contactItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-4 rounded-2xl border border-pink-100 bg-pink-50/30 p-6"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-pink-500">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="mt-1 block text-lg font-medium text-pink-900 hover:text-pink-600"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-lg font-medium text-pink-900">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          <RevealOnScroll y={40}>
            <div className="rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50 to-white p-10">
              <h3 className="font-display text-2xl font-bold text-pink-900">
                Need your reports?
              </h3>
              <p className="mt-4 text-pink-700/80">
                Patients can access and download their diagnostic reports through our
                secure online portal. Use your MRN (printed on your receipt) to sign in.
              </p>
              <div className="mt-8">
                <PrimaryLink href="/portal">Patient Portal →</PrimaryLink>
              </div>

              <div className="mt-10 rounded-2xl bg-white p-6 shadow-md shadow-pink-100/50">
                <p className="text-sm font-semibold text-pink-800">Forgot your password?</p>
                <p className="mt-2 text-sm text-pink-600">
                  Contact the center during business hours and our staff will help you
                  reset your portal access.
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
