"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <footer id="contact" className={styles.footer}>
      {/* Decorative Urdu Watermark */}
      <div className={styles.watermark} aria-hidden="true">واصفہ ڈائیگناسٹکس</div>

      <motion.div 
        className={styles.container}
        initial={{ opacity: 0, y: isMobile ? 0 : 12, scale: isMobile ? 0.98 : 1 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -50px 0px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className={styles.grid}>
          {/* Brand Introduction */}
          <div className={styles.brandColumn}>
            <span className={styles.brandName}>Wasfa Diagnostic Centre</span>
            <p className={styles.brandDesc}>
              Modern diagnostic care built around precision, comfort, and clarity.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className={styles.navColumn} aria-label="Footer Navigation">
            <span className={styles.groupTitle} aria-hidden="true">Navigation</span>
            <ul className={styles.navList}>
              <li><Link href="/#about" className={styles.link}>About</Link></li>
              <li><Link href="/#services" className={styles.link}>Services</Link></li>
              <li><Link href="/#doctors" className={styles.link}>Doctors</Link></li>
              <li><Link href="/#patient-portal" className={styles.link}>Patient Portal</Link></li>
            </ul>
          </nav>

          {/* Contact Details */}
          <div className={styles.contactColumn}>
            <span className={styles.groupTitle} aria-hidden="true">Contact</span>
            <address className={styles.address}>
              Wasfa Diagnostic Centre<br />
              Major Akram Shaheed Road<br />
              Azizabad, Jhelum<br />
              Punjab, Pakistan
            </address>
            <div className={styles.contactList}>
              <a href="tel:+923467122225" className={styles.link}>+92 346-7122225</a>
              <a href="tel:0544234111" className={styles.link}>0544-234111</a>
              <a href="mailto:wasfadiagnostic@yahoo.com" className={styles.link}>wasfadiagnostic@yahoo.com</a>
            </div>
          </div>
        </div>

        {/* Legal Bottom Row */}
        <div className={styles.legalRow}>
          <span className={styles.copyright}>© {currentYear} Wasfa Diagnostic Centre</span>
          <div className={styles.legalLinks}>
            <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
            <Link href="/terms" className={styles.link}>Terms & Conditions</Link>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
