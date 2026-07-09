"use client";

import { motion, useReducedMotion } from "motion/react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Threads from "../ui/Threads/Threads";
import styles from "./AboutSection.module.css";

export default function AboutSection() {
  const shouldReduceMotion = useReducedMotion();
  const supportsFinePointer = useMediaQuery("(pointer: fine)");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const groupVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : (isMobile ? 0 : 12),
      scale: isMobile ? 0.98 : 1
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const principles = [
    "Clear guidance",
    "Respectful care",
    "Reliable reporting",
  ];

  return (
    <section id="about" className={styles.aboutSection} aria-label="About Wasfa Diagnostic Centre">
      <div className={styles.backgroundAtmosphere} aria-hidden="true" />

      <div className={styles.threadsWrapper} aria-hidden="true">
        {!shouldReduceMotion && (
          <Threads
            color={[0.55, 0.08, 0.22]}
            amplitude={0.72}
            distance={0.12}
            enableMouseInteraction={supportsFinePointer}
          />
        )}
      </div>

      <div className={styles.readabilityOverlay} aria-hidden="true" />

      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      >
        <motion.div className={styles.introColumn} variants={groupVariants}>
          <p className={styles.sectionLabel}>About Wasfa</p>
          <h2 className={styles.heading}>A quieter way to understand your health.</h2>
        </motion.div>

        <motion.div className={styles.detailColumn} variants={groupVariants}>
          <p className={styles.bodyCopy}>
            Wasfa Diagnostic Centre brings modern diagnostic care together with a calm, respectful atmosphere. The experience is designed to feel clear from the first step in, with thoughtful service and dependable attention throughout.
          </p>
          <div className={styles.principles} aria-label="Wasfa care principles">
            {principles.map((principle) => (
              <span key={principle} className={styles.principlePill}>
                {principle}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
