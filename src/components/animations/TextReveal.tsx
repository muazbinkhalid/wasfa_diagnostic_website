"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

interface TextRevealProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
}

export function TextReveal({
  text,
  className = "",
  as: Tag = "h1",
  delay = 0,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const words = text.split(" ");
      el.innerHTML = words
        .map((w) => `<span class="inline-block overflow-hidden"><span class="word inline-block">${w}&nbsp;</span></span>`)
        .join("");

      gsap.from(el.querySelectorAll(".word"), {
        y: "110%",
        opacity: 0,
        duration: 0.9,
        stagger: 0.06,
        delay,
        ease: "power4.out",
      });
    },
    { scope: ref, dependencies: [text, delay] },
  );

  return <Tag ref={ref as never} className={className} />;
}
