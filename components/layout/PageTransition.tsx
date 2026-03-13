"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

const DURATION = 0.5;

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayPath, setDisplayPath] = useState(pathname);
  const [displayChildren, setDisplayChildren] = useState(children);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setDisplayPath(pathname);
      setDisplayChildren(children);
    }
  }, []);

  useEffect(() => {
    if (pathname === displayPath) {
      setDisplayChildren(children);
    }
  }, [pathname, children, displayPath]);

  const handleExitComplete = () => {
    setDisplayPath(pathname);
    setDisplayChildren(children);
  };

  const isTransitioning = pathname !== displayPath;

  return (
    <main className="relative flex-1 pt-16">
      <AnimatePresence mode="wait" onExitComplete={handleExitComplete} initial={false}>
        {isTransitioning ? (
          <>
            <motion.div
              key={displayPath}
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DURATION, ease: "easeInOut" }}
              className="min-h-full"
            >
              {displayChildren}
            </motion.div>
            <motion.div
              key={pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: DURATION, ease: "easeInOut" }}
              className="min-h-full"
            >
              {children}
            </motion.div>
          </>
        ) : (
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: DURATION, ease: "easeInOut" }}
            className="min-h-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
