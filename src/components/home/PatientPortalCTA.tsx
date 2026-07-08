"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import styles from "./PatientPortalCTA.module.css";

export default function PatientPortalCTA() {
  return (
    <motion.section 
      id="patient-portal" 
      className={styles.section}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className={styles.content}>
        <div className={styles.textGroup}>
          <span className={styles.label}>Patient Portal</span>
          <h2 className={styles.heading}>
            Your reports, available when you need them.
          </h2>
          <p className={styles.bodyCopy}>
            Access your diagnostic reports securely through the Wasfa Patient Portal.
          </p>
        </div>
        
        <div className={styles.buttonGroup}>
          <Link href="/patient-portal" className={styles.button}>
            Open Patient Portal
            <span className={styles.arrow} aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
