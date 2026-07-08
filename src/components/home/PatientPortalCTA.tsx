"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import styles from "./PatientPortalCTA.module.css";

export default function PatientPortalCTA() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <motion.section 
      id="patient-portal" 
      className={styles.section}
      initial={{ opacity: 0, y: isMobile ? 0 : 12, scale: isMobile ? 0.98 : 1 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
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
