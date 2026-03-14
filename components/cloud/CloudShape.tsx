"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CloudShapeProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  delay?: number;
  opacity?: number;
  clipLeft?: boolean;
  clipRight?: boolean;
}

const sizeMap = {
  sm: { width: 80,  height: 45 },
  md: { width: 130, height: 75 },
  lg: { width: 180, height: 100 },
};

export function CloudShape({
  className,
  size = "md",
  delay = 0,
  opacity = 0.9,
  clipLeft = false,
  clipRight = false,
}: CloudShapeProps) {
  const { width, height } = sizeMap[size];
  const id = `cloud-${delay}`.replace(".", "-");

  const viewWidth = 305;
  const viewHeight = 175;
  const clipX = clipLeft ? 10 : 0;
  const clipWidth = viewWidth - clipX - (clipRight ? 10 : 0);

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
      <svg
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter
            id={`rough-${id}`}
            x="-5%"
            y="-5%"
            width="110%"
            height="110%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.55"
              numOctaves="3"
              seed="5"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="3"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <clipPath id={`clip-${id}`}>
            <rect x={clipX} y="0" width={clipWidth} height={viewHeight} />
          </clipPath>
        </defs>

        <g
          clipPath={`url(#clip-${id})`}
          filter={`url(#rough-${id})`}
        >
          {/* Base wide body */}
          <ellipse cx="145" cy="135" rx="130" ry="35" fill="white" />
          {/* Left lobe */}
          <ellipse cx="55"  cy="108" rx="52"  ry="48" fill="white" />
          {/* Center-left lobe */}
          <ellipse cx="110" cy="88"  rx="56"  ry="54" fill="white" />
          {/* Top center lobe (tallest) */}
          <ellipse cx="155" cy="64"  rx="50"  ry="52" fill="white" />
          {/* Center-right lobe */}
          <ellipse cx="200" cy="88"  rx="56"  ry="52" fill="white" />
          {/* Right lobe */}
          <ellipse cx="248" cy="108" rx="50"  ry="46" fill="white" />
          {/* Inner soft depth */}
          <ellipse cx="145" cy="100" rx="118" ry="62" fill="white" opacity="0.4" />
        </g>
      </svg>
    </motion.div>
  );
}