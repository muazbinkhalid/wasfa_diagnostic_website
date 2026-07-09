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
  const [activeIndex, setActiveIndex] = useState<string | null>(null);

  return (
    <div className={styles.menuWrap}>
      {items.map((item) => (
        <FlowingMenuItem
          key={item.index}
          item={item}
          speed={speed}
          isActive={activeIndex === item.index}
          onActivate={() => setActiveIndex((current) => current === item.index ? null : item.index)}
        />
      ))}
    </div>
  );
}

function FlowingMenuItem({
  item,
  speed,
  isActive,
  onActivate,
}: {
  item: ServiceItem;
  speed: number;
  isActive: boolean;
  onActivate: () => void;
}) {
  const itemRef = useRef<HTMLAnchorElement>(null);
  const marqueeWrapRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const marqueePartRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const activeStateRef = useRef(false);

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
    activeStateRef.current = isActive;

    const wrap = marqueeWrapRef.current;
    if (!wrap) return;

    if (isActive) {
      if (tweenRef.current) tweenRef.current.play();
      gsap.to(wrap, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.35,
        ease: "power3.out",
        overwrite: true,
      });
    } else {
      if (tweenRef.current) tweenRef.current.pause();
      gsap.to(wrap, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        duration: 0.28,
        ease: "power3.out",
        overwrite: true,
      });
    }
  }, [isActive]);

  useEffect(() => {
    const inner = marqueeInnerRef.current;
    if (!inner) return;

    const ctx = gsap.context(() => {
      const parts = inner.children;
      if (parts.length === 0) return;

      const partWidth = (parts[0] as HTMLElement).offsetWidth;
      if (!partWidth) return;

      if (tweenRef.current) tweenRef.current.kill();
      
      // Animate from 0 to -partWidth, since all parts are identical, then wrap.
      // Use partWidth / 50 to maintain a constant physical speed of 50px per second.
      tweenRef.current = gsap.fromTo(
        inner,
        { x: 0 },
        {
          x: -partWidth,
          duration: partWidth / speed, 
          ease: "none",
          repeat: -1,
          paused: true,
        }
      );
    }, inner);

    return () => {
      if (tweenRef.current) tweenRef.current.kill();
      ctx.revert();
    };
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

      let isHovered = false;
      let isVisible = true;

      const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
        if (!isVisible && tweenRef.current) {
          tweenRef.current.pause();
        } else if (isVisible && isHovered && tweenRef.current) {
          tweenRef.current.play();
        }
      });
      observer.observe(el);

      const handleMouseEnter = (e: MouseEvent) => {
        if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
        isHovered = true;
        if (isVisible && tweenRef.current) tweenRef.current.play();
        const enterFromTop = getEnterFromTop(e);
        gsap.fromTo(
          wrap,
          { clipPath: enterFromTop ? clipTop : clipBottom },
          { clipPath: clipFull, duration: 0.5, ease: "power3.out", overwrite: true }
        );
      };

      const handleMouseLeave = (e: MouseEvent) => {
        if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
        isHovered = false;
        if (tweenRef.current) tweenRef.current.pause();
        const leaveFromTop = getEnterFromTop(e);
        gsap.to(wrap, {
          clipPath: leaveFromTop ? clipTop : clipBottom,
          duration: 0.5,
          ease: "power3.out",
          overwrite: true,
        });
      };

      const handleFocus = () => {
        isHovered = true;
        if (isVisible && tweenRef.current) tweenRef.current.play();
        gsap.to(wrap, { clipPath: clipFull, duration: 0.5, ease: "power3.out", overwrite: true });
      };

      const handleBlur = () => {
        if (activeStateRef.current) return;
        isHovered = false;
        if (tweenRef.current) tweenRef.current.pause();
        gsap.to(wrap, { clipPath: clipTop, duration: 0.5, ease: "power3.out", overwrite: true });
      };

      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
      el.addEventListener("focus", handleFocus);
      el.addEventListener("blur", handleBlur);

      return () => {
        observer.disconnect();
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
      className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ""}`}
      role={!item.href ? "button" : undefined}
      tabIndex={0}
      aria-pressed={!item.href ? isActive : undefined}
      onClick={(e) => {
        if (!item.href || window.matchMedia("(hover: none), (pointer: coarse)").matches) {
          e.preventDefault();
          onActivate();
        }
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
