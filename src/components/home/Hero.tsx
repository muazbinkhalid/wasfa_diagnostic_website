"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { TextReveal } from "@/components/animations/TextReveal";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { FadeIn } from "@/components/animations/FadeIn";
import { siteConfig } from "@/lib/site-config";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const blob1 = useRef<HTMLDivElement>(null);
  const blob2 = useRef<HTMLDivElement>(null);
  const blob3 = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(blob1.current, { scale: 0, opacity: 0, duration: 1.5 }, 0)
        .from(blob2.current, { scale: 0, opacity: 0, duration: 1.5 }, 0.2)
        .from(blob3.current, { scale: 0, opacity: 0, duration: 1.5 }, 0.4);

      gsap.to(blob1.current, {
        x: 30,
        y: -20,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(blob2.current, {
        x: -25,
        y: 15,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(blob3.current, {
        x: 20,
        y: 25,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden pt-24"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-blush to-rose-glow" />

      <div ref={blob1} className="absolute -left-20 top-32 h-80 w-80 rounded-full bg-pink-300/40 blob" />
      <div ref={blob2} className="absolute right-0 top-20 h-96 w-96 rounded-full bg-pink-400/25 blob" />
      <div ref={blob3} className="absolute bottom-20 left-1/3 h-64 w-64 rounded-full bg-pink-200/50 blob" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:px-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <FadeIn delay={0.2}>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-pink-600 backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-pink-500" />
              Jhelum&apos;s Trusted Diagnostic Center
            </span>
          </FadeIn>

          <TextReveal
            text="Your Health, Our Priority"
            className="font-display text-5xl font-bold leading-[1.1] tracking-tight text-pink-900 md:text-6xl lg:text-7xl"
            delay={0.4}
          />

          <FadeIn delay={0.8} y={30}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-pink-700/85">
              {siteConfig.description} Walk in for expert care, or access your lab reports
              securely online — anytime, anywhere.
            </p>
          </FadeIn>

          <FadeIn delay={1} y={30}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/portal">
                <MagneticButton className="rounded-full bg-gradient-to-r from-pink-500 to-pink-600 px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-pink-300/50">
                  Access My Reports →
                </MagneticButton>
              </Link>
              <Link
                href="/services"
                className="rounded-full border-2 border-pink-200 bg-white/60 px-8 py-4 text-sm font-semibold text-pink-700 backdrop-blur-sm transition-all hover:border-pink-300 hover:bg-white"
              >
                Explore Services
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={1.2} y={20}>
            <div className="mt-12 flex flex-wrap gap-8 text-sm text-pink-600">
              <div>
                <p className="text-2xl font-bold text-pink-800">24h</p>
                <p>Fast Reports</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-pink-800">50+</p>
                <p>Test Types</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-pink-800">10K+</p>
                <p>Happy Patients</p>
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.6} className="relative hidden lg:block">
          <div className="relative mx-auto aspect-square max-w-md">
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-pink-200 to-pink-400/30 shadow-2xl shadow-pink-300/40" />
            <div className="absolute inset-4 flex flex-col items-center justify-center rounded-[2rem] glass p-8">
              <Image
                src="/logo.png"
                alt="WASFA Diagnostic"
                width={120}
                height={120}
                className="mb-6 drop-shadow-lg"
              />
              <p className="text-center font-display text-2xl font-bold text-pink-800">
                WASFA Diagnostic
              </p>
              <p className="mt-2 text-center text-sm text-pink-600">
                Precision · Compassion · Trust
              </p>
              <div className="mt-8 w-full space-y-3">
                {["Lab Tests", "Ultrasound", "X-Ray", "ECG"].map((s) => (
                  <div
                    key={s}
                    className="flex items-center gap-3 rounded-xl bg-pink-50/80 px-4 py-3 text-sm font-medium text-pink-700"
                  >
                    <span className="h-2 w-2 rounded-full bg-pink-500" />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-pink-400">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="h-10 w-6 rounded-full border-2 border-pink-300 p-1">
            <div className="mx-auto h-2 w-1 animate-bounce rounded-full bg-pink-400" />
          </div>
        </div>
      </div>
    </section>
  );
}
