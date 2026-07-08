"use client";

import { motion, useReducedMotion } from "motion/react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Threads from "../ui/Threads/Threads";
import styles from "./AboutSection.module.css";

export default function AboutSection() {
  const shouldReduceMotion = useReducedMotion();
  const supportsFinePointer = useMediaQuery("(pointer: fine)");

  // Entrance animation: opacity + 16px upward, ~0.7s
  const groupVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <section id="about" className={styles.aboutSection} aria-label="About Wasfa Diagnostic Centre">
      {/* CSS Ambient Background */}
      <div className={styles.backgroundAtmosphere} aria-hidden="true" />
      
      {/* Threads WebGL Layer */}
      <div className={styles.threadsWrapper} aria-hidden="true">
        {(!shouldReduceMotion) && (
          <Threads
            color={[0.70, 0.10, 0.25]}
            amplitude={1.2} /* Gentler amplitude for About section */
            distance={0.22}
            enableMouseInteraction={supportsFinePointer}
          />
        )}
      </div>

      {/* Readability Overlay */}
      <div className={styles.readabilityOverlay} aria-hidden="true" />

      <motion.div 
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
      >
        
        {/* Group 1: Left Column (Label + Heading) */}
        <motion.div className={styles.leftColumn} variants={groupVariants}>
          <div className={styles.sectionLabel}>About Wasfa</div>
          <h2 className={styles.heading}>
            Diagnostics should bring clarity,<br />
            not uncertainty.
          </h2>
        </motion.div>

        {/* Group 2: Right Column (Body + Location) */}
        <motion.div className={styles.rightColumn} variants={groupVariants}>
          <div className={styles.bodyCopy}>
            Wasfa Diagnostic Centre is a modern diagnostic facility in Jhelum, Punjab, offering professional checkups and testing in a calm, respectful, and dependable environment.
          </div>
          <div className={styles.locationContainer}>
            <div className={styles.locationLine} aria-hidden="true" />
            <span className={styles.locationText}>Jhelum, Punjab, Pakistan</span>
          </div>
        </motion.div>

      </motion.div>

      {/* Subtle Urdu Watermark */}
      <div className={styles.watermark} aria-hidden="true">وصفہ</div>
    </section>
  );
}
