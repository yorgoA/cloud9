"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className, hover = true, onClick }: GlassCardProps) {
  return (
    <motion.div
      role={onClick ? "button" : undefined}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      className={cn(
        "glass-card cloud-card border-2 border-latte-beige/70 bg-gradient-to-br from-soft-white via-[#f8f5f0] to-powder-blue/20 shadow-soft backdrop-blur-xl",
        hover && "transition-shadow duration-300 hover:shadow-glass",
        onClick && "cursor-pointer",
        className
      )}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1.0
       }}
    >
      {children}
    </motion.div>
  );
}
