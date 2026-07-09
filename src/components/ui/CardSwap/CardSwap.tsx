"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import styles from "./CardSwap.module.css";

export interface DoctorCardData {
  index: string;
  name: string;
  role: string;
  qualifications: string;
  description: string;
}

interface CardSwapProps {
  cards: DoctorCardData[];
}

export default function CardSwap({ cards }: CardSwapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Track which card is in front
  const [frontIndex, setFrontIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) setIsVisible(false);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    const observer = new IntersectionObserver(
      (entries) => {
        setIsVisible(entries[0].isIntersecting && !document.hidden);
      },
      { threshold: 0.1 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth <= 768);
      setShouldReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Initialize side-by-side 50% spread layout
  useEffect(() => {
    if (isMobile || shouldReduceMotion) {
      if (timelineRef.current) timelineRef.current.kill();
      cardsRef.current.forEach((card) => {
        if (card) gsap.set(card, { clearProps: "all" });
      });
      return;
    }

    const card0 = cardsRef.current[0];
    const card1 = cardsRef.current[1];
    if (!card0 || !card1) return;

    if (frontIndex === 0) {
      gsap.set(card0, { x: -60, y: 0, scale: 1, rotateY: 0, zIndex: 2 });
      gsap.set(card1, { x: 100, y: 10, scale: 0.95, rotateY: -2, zIndex: 1 });
    } else {
      gsap.set(card1, { x: -60, y: 0, scale: 1, rotateY: 0, zIndex: 2 });
      gsap.set(card0, { x: 100, y: 10, scale: 0.95, rotateY: -2, zIndex: 1 });
    }
  }, [isMobile, shouldReduceMotion, frontIndex]);

  const handleSwap = useCallback((clickedIndex: number) => {
    if (shouldReduceMotion) return;
    if (clickedIndex === frontIndex) return;

    if (isMobile) {
      setFrontIndex(clickedIndex);
      return;
    }

    const frontCard = cardsRef.current[frontIndex];
    const backCard = cardsRef.current[clickedIndex];
    if (!frontCard || !backCard) return;

    if (timelineRef.current) timelineRef.current.kill();
    timelineRef.current = gsap.timeline();

    // 1. Old front card swoops right and back
    timelineRef.current.to(frontCard, {
      x: 100,
      y: 10,
      scale: 0.95,
      rotateY: -2,
      zIndex: 1,
      duration: 0.7,
      ease: "power3.inOut",
      onStart: () => {
        frontCard.style.zIndex = "1";
      }
    }, 0);

    // 2. Back card sweeps left and forward to become the hero
    timelineRef.current.to(backCard, {
      x: -60,
      y: 0,
      scale: 1,
      rotateY: 0,
      zIndex: 2,
      duration: 0.7,
      ease: "power3.inOut",
      onStart: () => {
        backCard.style.zIndex = "2";
      }
    }, 0);

    setFrontIndex(clickedIndex);
  }, [frontIndex, isMobile, shouldReduceMotion]);

  useEffect(() => {
    if (isMobile || shouldReduceMotion) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    
    if (!isHovered && isVisible) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        handleSwap(frontIndex === 0 ? 1 : 0);
      }, 5500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, isVisible, isMobile, shouldReduceMotion, frontIndex, handleSwap]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!shouldReduceMotion) handleSwap(index);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (isMobile || shouldReduceMotion) return;
    const backCard = cardsRef.current[frontIndex === 0 ? 1 : 0];
    if (backCard) {
      // Invite interaction by pushing the spread out a bit more
      gsap.to(backCard, { x: 120, rotateY: -4, duration: 0.4, ease: "power2.out" });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (isMobile || shouldReduceMotion) return;
    const backCard = cardsRef.current[frontIndex === 0 ? 1 : 0];
    if (backCard) {
      gsap.to(backCard, { x: 100, rotateY: -2, duration: 0.4, ease: "power2.out" });
    }
  };

  return (
    <div className={styles.cardSwapWrapper}>
      <div 
        className={`${styles.perspectiveContainer} ${isMobile && !shouldReduceMotion ? styles.mobileSwapContainer : ""}`} 
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
      >
        {cards.map((card, idx) => {
          const isFront = shouldReduceMotion ? true : idx === frontIndex;
          
          return (
            <article
              key={`${card.index}-${idx}`}
              className={styles.card}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
              data-is-front={isFront}
              data-mobile-front={isMobile && isFront}
              onClick={() => handleSwap(idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              tabIndex={shouldReduceMotion ? undefined : 0}
              role={shouldReduceMotion ? "article" : "button"}
              aria-label={
                shouldReduceMotion 
                  ? `Profile of ${card.name}` 
                  : isFront 
                    ? `Profile of ${card.name}. Front card.` 
                    : `Profile of ${card.name}. Click to bring to front.`
              }
              aria-hidden="false"
            >
              {/* Urdu Watermark */}
              <div className={styles.watermark} aria-hidden="true">واصفہ</div>

              <div className={styles.cardHeader}>
                <span className={styles.cardIndex}>{card.index}</span>
                <span className={styles.categoryLabel}>Radiology</span>
              </div>
              
              <div className={styles.cardBody}>
                <h3 className={styles.doctorName}>{card.name}</h3>
                <div className={styles.roleGroup}>
                  <p className={styles.doctorRole}>{card.role}</p>
                  <p className={styles.doctorQuals}>{card.qualifications}</p>
                </div>
                <p className={styles.doctorDesc}>{card.description}</p>
              </div>
            </article>
          );
        })}
      </div>
      {isMobile && !shouldReduceMotion && (
        <div className={styles.mobileControls} aria-label="Choose doctor profile">
          {cards.map((card, idx) => (
            <button
              key={card.index}
              type="button"
              className={`${styles.mobileDot} ${idx === frontIndex ? styles.mobileDotActive : ""}`}
              aria-label={`Show ${card.name}`}
              aria-pressed={idx === frontIndex}
              onClick={() => handleSwap(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
