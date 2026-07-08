"use client";

import { motion, useReducedMotion } from "motion/react";
import CardSwap from "../ui/CardSwap/CardSwap";
import styles from "./DoctorsSection.module.css";

import { useMediaQuery } from "@/hooks/useMediaQuery";

const doctors = [
  {
    index: "01",
    name: "Dr. Khalid Mehmood",
    role: "Senior Radiologist",
    qualifications: "MBBS, DCPS, MCPS",
    description:
      "Specializing in general and interventional diagnostic imaging with over a decade of clinical experience.",
  },
  {
    index: "02",
    name: "Dr. Wasfa Gul",
    role: "Consultant Radiologist",
    qualifications: "FCPS (Diagnostic Radiology)",
    description:
      "Expert in high-end cross-sectional imaging, including MRI, CT, and ultrasound diagnostics.",
  },
];

export default function DoctorsSection() {
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : (isMobile ? 0 : 12),
      scale: isMobile ? 0.98 : 1
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section id="doctors" className={styles.doctorsSection} aria-labelledby="doctors-heading">
      <div className={styles.backgroundAtmosphere} aria-hidden="true" />
      <div className={styles.readabilityOverlay} aria-hidden="true" />
      
      <motion.div
        className={styles.container}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      >
        <motion.div className={styles.rightColumn} variants={itemVariants}>
          <CardSwap cards={doctors} />
        </motion.div>

        <motion.div className={styles.introColumn} variants={itemVariants}>
          <p className={styles.sectionLabel}>Our Doctors</p>
          <h2 id="doctors-heading" className={styles.heading}>
            Expert eyes behind every diagnosis.
          </h2>
          <p className={styles.bodyCopy}>
            Wasfa brings together experienced radiologists with expertise across general, interventional, and advanced cross-sectional imaging.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
