"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./MetricsSection.module.css";

const metrics = [
  { value: "2600+", label: "Active Patients" },
  { value: "6+", label: "Services" },
  { value: "2+", label: "Doctors" },
  { value: "100%", label: "Satisfaction" },
];

export default function MetricsSection() {
  return (
    <motion.section 
      className={styles.metricsSection} 
      aria-label="Key Metrics"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className={styles.container}>
        {metrics.map((metric, idx) => (
          <div key={idx} className={styles.metricItem}>
            <span className={styles.metricValue}>{metric.value}</span>
            <span className={styles.metricLabel}>{metric.label}</span>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
