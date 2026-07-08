"use client";

import { useRef, ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  y?: number;
  stagger?: number;
}

export function RevealOnScroll({
  children,
  className = "",
  y = 60,
  stagger = 0.1,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const items = el.children.length > 0 ? el.children : [el];

      gsap.from(items, {
        opacity: 0,
        y,
        duration: 0.8,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: ref, dependencies: [y, stagger] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
