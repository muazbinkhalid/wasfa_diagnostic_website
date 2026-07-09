"use client";

// removed unused react imports
import { motion, useReducedMotion } from "motion/react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Threads from "../ui/Threads/Threads";
import styles from "./Hero.module.css";

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const supportsFinePointer = useMediaQuery("(pointer: fine)");
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Animation variants
  const headingVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : (isMobile ? 0 : 12),
      scale: isMobile ? 0.98 : 1
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  const taglineVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : (isMobile ? 0 : 12) },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 }
    }
  };

  return (
    <section id="home" className={styles.hero} aria-label="Wasfa Diagnostic Centre Introduction">
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
          واصفہ ڈائیگناسٹکس
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
