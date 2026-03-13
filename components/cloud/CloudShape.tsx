"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CloudShapeProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  delay?: number;
  opacity?: number;
}

const sizeMap = {
  sm: { width: 120, height: 60 },
  md: { width: 200, height: 100 },
  lg: { width: 280, height: 140 },
};

/** Realistic cloud shape: multiple overlapping circles/puffs */
export function CloudShape({
  className,
  size = "md",
  delay = 0,
  opacity = 0.9,
}: CloudShapeProps) {
  const { width, height } = sizeMap[size];
  return (
    <motion.div
      className={cn("absolute", className)}
      style={{ opacity, width, height }}
      initial={{ y: 0, x: 0 }}
      animate={{
        y: [0, -20, 0],
        x: [0, 40, 0],
      }}
      transition={{
        duration: 24,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      aria-hidden
    >
      <svg
        viewBox="0 0 200 100"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="cloud-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#f5f0e8" stopOpacity="0.9" />
          </linearGradient>
          <filter id="cloud-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.08" />
          </filter>
        </defs>
        <g filter="url(#cloud-shadow)">
          <path
            d="M 30 55 
               Q 45 35, 65 40 
               Q 85 25, 110 40 
               Q 135 30, 160 45 
               Q 175 55, 165 70 
               Q 180 80, 150 85 
               Q 165 95, 120 90 
               Q 100 95, 80 88 
               Q 50 95, 35 80 
               Q 15 75, 25 60 Z"
            fill="url(#cloud-gradient)"
          />
        </g>
      </svg>
    </motion.div>
  );
}
