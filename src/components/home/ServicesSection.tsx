"use client";

import { motion, useReducedMotion } from "motion/react";
import FlowingMenu from "../ui/FlowingMenu/FlowingMenu";
import styles from "./ServicesSection.module.css";

const services = [
  {
    index: "01",
    name: "Open MRI (GE USA)",
    caption: "High-field, patient-friendly Open MRI system",
  },
  {
    index: "02",
    name: "High-Speed 16 Slice CT Scan",
    caption: "Rapid, high-resolution trauma and elective scanning",
  },
  {
    index: "03",
    name: "Mammography",
    caption: "Breast cancer screening & diagnostic imaging",
  },
  {
    index: "04",
    name: "C.R. Digital X-Ray",
    caption: "Plain & contrast studies with low radiation dose",
  },
  {
    index: "05",
    name: "Ultrasonography",
    caption: "Vascular flow evaluation & guided biopsy procedures",
  },
  {
    index: "06",
    name: "Pathology Lab",
    caption: "Hormones & body fluid analysis",
  },
];

export default function ServicesSection() {
  const shouldReduceMotion = useReducedMotion();

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section id="services" className={styles.servicesSection} aria-label="Wasfa Diagnostic Services">
      <div className={styles.backgroundAtmosphere} aria-hidden="true" />

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        style={{ width: '100%' }}
      >
        <div className={styles.introContainer}>
          <motion.div className={styles.introArea} variants={itemVariants}>
            <p className={styles.sectionLabel}>Services</p>
            <h2 className={styles.heading}>
              Advanced diagnostics,<br />
              delivered with clarity.
            </h2>
            <p className={styles.bodyCopy}>
              A focused range of imaging and laboratory services for confident clinical decisions.
            </p>
          </motion.div>
        </div>

        <motion.div className={styles.menuContainer} variants={itemVariants}>
          <FlowingMenu items={services} speed={50} />
        </motion.div>
      </motion.div>
    </section>
  );
}
