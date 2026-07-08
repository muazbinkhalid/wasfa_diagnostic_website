"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import styles from "./FlowingMenu.module.css";

interface ServiceItem {
  index: string;
  name: string;
  caption: string;
  href?: string;
}

interface FlowingMenuProps {
  items: ServiceItem[];
  speed?: number;
}

export default function FlowingMenu({ items, speed = 20 }: FlowingMenuProps) {
  return (
    <div className={styles.menuWrap}>
      {items.map((item) => (
        <FlowingMenuItem key={item.index} item={item} speed={speed} />
      ))}
    </div>
  );
}

function FlowingMenuItem({ item, speed }: { item: ServiceItem; speed: number }) {
  const itemRef = useRef<HTMLAnchorElement>(null);
  const marqueeWrapRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const marqueePartRef = useRef<HTMLDivElement>(null);

  const [repetitions, setRepetitions] = useState(4);

  useEffect(() => {
    const el = itemRef.current;
    const part = marqueePartRef.current;
    if (!el || !part) return;

    let resizeTimeout: ReturnType<typeof setTimeout>;

    const observer = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!el || !part) return;
        const elWidth = el.offsetWidth;
        const partWidth = part.offsetWidth;
        if (partWidth === 0) return;
        const needed = Math.max(4, Math.ceil(elWidth / partWidth) + 2);
        setRepetitions((prev) => (prev !== needed ? needed : prev));
      }, 150);
    });

    observer.observe(el);
    observer.observe(part);

    return () => {
      observer.disconnect();
      clearTimeout(resizeTimeout);
    };
  }, []);

  useEffect(() => {
    const inner = marqueeInnerRef.current;
    if (!inner) return;

    const ctx = gsap.context(() => {
      const parts = inner.children;
      if (parts.length === 0) return;

      const partWidth = (parts[0] as HTMLElement).offsetWidth;
      if (!partWidth) return;

      // Animate from 0 to -partWidth, since all parts are identical, then wrap.
      // Use partWidth / 50 to maintain a constant physical speed of 50px per second.
      gsap.fromTo(
        inner,
        { x: 0 },
        {
          x: -partWidth,
          duration: partWidth / 50, 
          ease: "none",
          repeat: -1,
        }
      );
    }, inner);

    return () => ctx.revert();
  }, [repetitions, speed]);

  useEffect(() => {
    const el = itemRef.current;
    const wrap = marqueeWrapRef.current;
    if (!el || !wrap) return;

    const ctx = gsap.context(() => {
      // clip-path states
      const clipTop = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";
      const clipBottom = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";
      const clipFull = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

      const getEnterFromTop = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        return e.clientY < rect.top + rect.height / 2;
      };

      const handleMouseEnter = (e: MouseEvent) => {
        const enterFromTop = getEnterFromTop(e);
        gsap.fromTo(
          wrap,
          { clipPath: enterFromTop ? clipTop : clipBottom },
          { clipPath: clipFull, duration: 0.5, ease: "power3.out", overwrite: true }
        );
      };

      const handleMouseLeave = (e: MouseEvent) => {
        const leaveFromTop = getEnterFromTop(e);
        gsap.to(wrap, {
          clipPath: leaveFromTop ? clipTop : clipBottom,
          duration: 0.5,
          ease: "power3.out",
          overwrite: true,
        });
      };

      const handleFocus = () => {
        gsap.to(wrap, { clipPath: clipFull, duration: 0.5, ease: "power3.out", overwrite: true });
      };

      const handleBlur = () => {
        gsap.to(wrap, { clipPath: clipTop, duration: 0.5, ease: "power3.out", overwrite: true });
      };

      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
      el.addEventListener("focus", handleFocus);
      el.addEventListener("blur", handleBlur);

      return () => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
        el.removeEventListener("focus", handleFocus);
        el.removeEventListener("blur", handleBlur);
      };
    }, el);

    return () => ctx.revert();
  }, []);

  const MarqueeContent = () => (
    <>
      <span className={styles.marqueeIndex}>{item.index}</span>
      <span className={styles.marqueeName}>{item.name}</span>
      <span className={styles.marqueeDot} aria-hidden="true" />
      <span className={styles.marqueeCaption}>{item.caption}</span>
      <span className={styles.marqueeDot} aria-hidden="true" />
    </>
  );

  return (
    <a
      ref={itemRef}
      href={item.href || "#"}
      className={styles.menuItem}
      role={!item.href ? "button" : undefined}
      tabIndex={0}
      onClick={(e) => {
        if (!item.href) e.preventDefault();
      }}
    >
      <div className={styles.itemGrid}>
        <span className={styles.itemIndex}>{item.index}</span>
        <span className={styles.itemName}>{item.name}</span>
        <span className={styles.itemCaption}>{item.caption}</span>
      </div>

      <div className={styles.marqueeWrap} ref={marqueeWrapRef} aria-hidden="true">
        <div className={styles.marqueeInner} ref={marqueeInnerRef}>
          {Array.from({ length: repetitions }).map((_, i) => (
            <div
              key={i}
              className={styles.marqueePart}
              ref={i === 0 ? marqueePartRef : null}
            >
              <MarqueeContent />
            </div>
          ))}
        </div>
      </div>
    </a>
  );
}
