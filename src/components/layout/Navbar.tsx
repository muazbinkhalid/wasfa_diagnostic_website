"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useReducedMotion } from "motion/react";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { NAVIGATION_ITEMS } from "@/config/navigation";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 24);
  });

  // Handle escape key to close menu
  useEscapeKey(() => setIsMenuOpen(false), isMenuOpen);

  // Handle resize to close menu when moving back to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 820 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  // Prevent body scroll when mobile menu is open (optional, but good practice for full-screen-ish menus. 
  // Requirement says: "do not lock body scrolling unless genuinely required". Since it's just a small dropdown, we'll skip locking it.)

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // Entrance animation variants
  const navbarVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  const mobilePanelVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }
    },
    exit: { 
      opacity: 0, 
      y: -5,
      transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <motion.header
      className={`${styles.navbar} ${isScrolled ? styles.navbarScrolled : ""}`}
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={`${styles.topBar} ${isScrolled ? styles.topBarHidden : ""}`}>
        <div className={styles.topBarInner}>
          <div className={styles.topBarGroup}>
            <span className={styles.topBarItem}>Major Akram Shaheed Road, Azizabad, Jhelum</span>
          </div>
          <div className={styles.topBarGroup}>
            <span className={styles.topBarItem}>Mon-Sat: 8:00 AM - 8:00 PM (Sun Off)</span>
            <span className={styles.topBarDivider}>|</span>
            <span className={styles.topBarItem}>+92 346-7122225 / 0544-234111</span>
          </div>
        </div>
      </div>
      <div className={styles.inner}>
        
        {/* Left: Logo */}
        <div className={styles.leftColumn}>
          <Link href="/#home" className={styles.logoLink} aria-label="Wasfa Diagnostic Centre — Home" onClick={() => setIsMenuOpen(false)}>
            <Image
              src="/logo.png"
              alt=""
              width={96}
              height={96}
              priority
              className={styles.logoImage}
            />
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className={`${styles.centerColumn} ${styles.desktopNav}`} aria-label="Main navigation">
          <ul className={styles.desktopNavList}>
            {NAVIGATION_ITEMS.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className={styles.navLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right: CTA & Mobile Toggle */}
        <div className={styles.rightColumn}>
          <button
            type="button"
            className={styles.menuTrigger}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={toggleMenu}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {isMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>

          <Link href="/patient-portal" className={`${styles.ctaButton} ${styles.headerCta}`} aria-label="Patient Portal">
            <span>Patient Portal</span>
            <svg className={styles.ctaArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            id="mobile-navigation"
            className={styles.mobilePanel}
            variants={shouldReduceMotion ? undefined : mobilePanelVariants}
            initial={shouldReduceMotion ? { opacity: 0 } : "hidden"}
            animate={shouldReduceMotion ? { opacity: 1 } : "visible"}
            exit={shouldReduceMotion ? { opacity: 0 } : "exit"}
            aria-label="Mobile navigation"
          >
            <ul className={styles.mobileNavList}>
              {NAVIGATION_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link 
                    href={item.href} 
                    className={styles.mobileNavLink}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className={styles.mobilePanelFooter}>
              <Link href="/patient-portal" className={`${styles.ctaButton} ${styles.mobilePanelCta}`} aria-label="Patient Portal" onClick={() => setIsMenuOpen(false)}>
                Patient Portal
                <svg className={styles.ctaArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
