"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import styles from "./MetricsSection.module.css";

const metrics = [
  { value: "2600+", label: "Active Patients" },
  { value: "6+", label: "Services" },
  { value: "2+", label: "Doctors" },
  { value: "100%", label: "Satisfaction" },
];

export default function MetricsSection() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section className={styles.metricsSection} aria-label="Key Metrics">
      <motion.div 
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      >
        {metrics.map((metric, idx) => (
          <motion.div key={idx} className={styles.metricItem} variants={itemVariants}>
            <span className={styles.metricValue}>{metric.value}</span>
            <span className={styles.metricLabel}>{metric.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
