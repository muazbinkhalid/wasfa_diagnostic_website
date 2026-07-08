"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { stats } from "@/lib/site-config";

export function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const items = sectionRef.current?.querySelectorAll(".stat-value");
      if (!items) return;

      items.forEach((el) => {
        const target = el.getAttribute("data-value") ?? "0";
        const numeric = parseInt(target.replace(/\D/g, ""), 10);
        const suffix = target.replace(/[\d]/g, "");

        const counter = { val: 0 };
        gsap.to(counter, {
          val: numeric,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
          },
          onUpdate: () => {
            el.textContent = Math.round(counter.val) + suffix;
          },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-pink-600 to-pink-500 py-16"
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 md:grid-cols-4 md:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p
              className="stat-value text-4xl font-bold text-white md:text-5xl"
              data-value={stat.value}
            >
              0
            </p>
            <p className="mt-2 text-sm font-medium text-pink-100">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
