"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** duration in seconds */
  duration?: number;
  /** delay in seconds */
  delay?: number;
  /** offset for viewport trigger (0-1 or px) */
  amount?: number | "some" | "all";
};

const defaultVariants = (duration = 0.6, delay = 0): Variants => ({
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration, delay, ease: [0.215, 0.61, 0.355, 1] },
  },
});

export default function Reveal({
  children,
  className = "",
  duration = 0.6,
  delay = 0,
  amount = 0.12,
}: RevealProps) {
  const variants = defaultVariants(duration, delay);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
