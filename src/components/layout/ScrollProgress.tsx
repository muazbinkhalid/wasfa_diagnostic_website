"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import styles from "./ScrollProgress.module.css";

export default function ScrollProgress() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scale = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.35,
  });

  if (shouldReduceMotion) return null;

  return (
    <div className={styles.track} aria-hidden="true">
      <motion.div className={styles.indicator} style={{ scaleY: scale, scaleX: scale }} />
    </div>
  );
}
