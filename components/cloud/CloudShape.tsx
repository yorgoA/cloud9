"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CloudShapeProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  delay?: number;
  opacity?: number;
}

const sizeMap = {
  sm: { width: 100, height: 66 },
  md: { width: 160, height: 106 },
  lg: { width: 220, height: 146 },
};

export function CloudShape({
  className,
  size = "md",
  delay = 0,
  opacity = 0.9,
}: CloudShapeProps) {
  const { width, height } = sizeMap[size];

  return (
    <motion.div
      className={cn("absolute pointer-events-none", className)}
      style={{ opacity, width, height }}
      initial={{ y: 0, x: 0 }}
      animate={{ y: [0, -12, 0], x: [0, 25, 0] }}
      transition={{
        duration: 24,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      aria-hidden
    >
      <Image
        src="/brand/cloud-beige.png"
        alt=""
        width={width}
        height={height}
        className="h-full w-full object-contain"
      />
    </motion.div>
  );
}
