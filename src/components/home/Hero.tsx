"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Threads from "../ui/Threads/Threads";
import styles from "./Hero.module.css";

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const [supportsFinePointer, setSupportsFinePointer] = useState(false);

  useEffect(() => {
    // Detect fine pointer for interaction, falling back to false on touch devices
    const mediaQuery = window.matchMedia("(pointer: fine)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupportsFinePointer(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setSupportsFinePointer(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Animation variants
  const headingVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20,
      filter: shouldReduceMotion ? "blur(0px)" : "blur(8px)" 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  const taglineVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: 0.15 }
    }
  };

  return (
    <section className={styles.hero} aria-label="Wasfa Diagnostic Centre Introduction">
      {/* CSS Ambient Background */}
      <div className={styles.backgroundAtmosphere} aria-hidden="true" />
      
      {/* Threads WebGL Layer */}
      <div className={styles.threadsWrapper} aria-hidden="true">
        {(!shouldReduceMotion) && (
          <Threads
            color={[0.70, 0.10, 0.25]} /* Cherry red/rose tones mapped to RGB ratios */
            amplitude={2.4} /* Increased amplitude for more vertical wave span */
            distance={0.22}
            enableMouseInteraction={supportsFinePointer}
          />
        )}
      </div>

      {/* Readability Overlay */}
      <div className={styles.readabilityOverlay} aria-hidden="true" />

      {/* Content */}
      <div className={styles.content}>
        <motion.h1
          className={styles.heading}
          lang="ur"
          dir="rtl"
          variants={headingVariants}
          initial="hidden"
          animate="visible"
        >
          وصفہ ڈائیگناسٹکس
        </motion.h1>
        
        <motion.p
          className={styles.tagline}
          variants={taglineVariants}
          initial="hidden"
          animate="visible"
        >
          Clarity in diagnosis. Confidence in care.
        </motion.p>
      </div>
    </section>
  );
}
