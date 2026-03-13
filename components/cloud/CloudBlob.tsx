"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CloudBlobProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  delay?: number;
  style?: React.CSSProperties;
  opacity?: number;
}

const sizeMap = {
  sm: "w-32 h-20",
  md: "w-64 h-40",
  lg: "w-96 h-56",
};

export function CloudBlob({
  className,
  size = "md",
  delay = 0,
  style,
  opacity = 0.4,
}: CloudBlobProps) {
  return (
    <motion.div
      className={cn(
        "cloud-blob absolute bg-gradient-to-br from-powder-blue to-sky-blue",
        sizeMap[size],
        className
      )}
      style={{
        ...style,
        opacity,
        borderRadius: "60% 40% 50% 50% / 60% 50% 50% 40%",
      }}
      initial={{ y: 0, x: 0 }}
      animate={{
        y: [0, -8, 0],
        x: [0, 4, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      aria-hidden
    />
  );
}
