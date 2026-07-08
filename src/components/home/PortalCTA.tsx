"use client";

import Link from "next/link";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { MagneticButton } from "@/components/animations/MagneticButton";

export function PortalCTA() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/50 via-blush to-pink-50" />
      <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-pink-300/20 blob" />

      <div className="relative mx-auto max-w-7xl">
        <RevealOnScroll>
          <div className="overflow-hidden rounded-[2.5rem] border border-pink-200/60 bg-white/80 p-10 shadow-2xl shadow-pink-200/30 backdrop-blur-xl md:p-16">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-pink-500">
                  Patient Portal
                </p>
                <h2 className="font-display text-3xl font-bold text-pink-900 md:text-4xl">
                  Your reports, ready when you are
                </h2>
                <p className="mt-4 text-pink-700/80">
                  Sign in with your MRN (printed on your receipt) to view and download
                  your diagnostic reports securely. No app download required.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-pink-700">
                  <li className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-100 text-xs">✓</span>
                    Secure, encrypted access
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-100 text-xs">✓</span>
                    Download PDF reports instantly
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-100 text-xs">✓</span>
                    View your complete visit history
                  </li>
                </ul>
              </div>

              <div className="flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-pink-50 to-pink-100/50 p-10">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-4xl shadow-lg shadow-pink-200/50">
                  📄
                </div>
                <p className="mb-6 text-center text-sm text-pink-600">
                  Use your MRN as Login ID
                </p>
                <Link href="/portal">
                  <MagneticButton className="w-full rounded-full bg-gradient-to-r from-pink-500 to-pink-600 px-10 py-4 text-sm font-semibold text-white shadow-xl shadow-pink-300/50">
                    Sign In to Portal →
                  </MagneticButton>
                </Link>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
