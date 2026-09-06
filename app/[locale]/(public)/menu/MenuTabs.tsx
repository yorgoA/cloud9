"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DisplayMenuItem {
  id: string;
  name: string;
  description: string | null;
  price_cents: number | null;
  imageUrl: string | null;
}

interface MenuSubcategory {
  label: string;
  items: DisplayMenuItem[];
}

interface MenuGroup {
  label: string;
  subs: MenuSubcategory[];
}

function formatPrice(cents: number | null): string {
  if (cents == null) return "—";
  return `€${(cents / 100).toFixed(2)}`;
}

export function MenuTabs({ groups }: { groups: MenuGroup[] }) {
  const [activeGroup, setActiveGroup] = useState(0);
  const [activeSub, setActiveSub] = useState(0);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const group = groups[activeGroup];
  const sub = group.subs[activeSub];

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3">
        {groups.map((g, i) => (
          <button
            key={g.label}
            type="button"
            onClick={() => {
              setActiveGroup(i);
              setActiveSub(0);
              setPreviewId(null);
            }}
            className={cn(
              "relative rounded-full px-6 py-2.5 text-base font-bold uppercase tracking-wide transition-colors",
              i === activeGroup ? "text-cream" : "text-espresso hover:text-espresso/70"
            )}
          >
            {i === activeGroup ? (
              <motion.span
                layoutId="menu-group-pill"
                className="absolute inset-0 rounded-full border-2 border-espresso bg-dusty-blue shadow-hard-sm"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            ) : (
              <span className="absolute inset-0 rounded-full border-2 border-espresso/30 bg-cream" />
            )}
            <span className="relative">{g.label}</span>
          </button>
        ))}
      </div>

      {group.subs.length > 1 && (
        <div className="-mx-4 mt-5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex w-max gap-1 sm:w-full sm:flex-wrap sm:justify-center">
            {group.subs.map((s, i) => (
              <button
                key={s.label}
                type="button"
                onClick={() => {
                  setActiveSub(i);
                  setPreviewId(null);
                }}
                className="relative shrink-0 px-3.5 py-1.5 text-sm font-semibold transition-colors"
              >
                {i === activeSub && (
                  <motion.span
                    layoutId="menu-sub-underline"
                    className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-espresso"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className={cn("relative", i === activeSub ? "text-espresso" : "text-stone-500 hover:text-espresso")}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeGroup}-${activeSub}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="mt-8 space-y-3"
        >
          {sub.items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 8) * 0.04, duration: 0.35, ease: "easeOut" }}
              className="relative"
              onMouseEnter={() => item.imageUrl && setPreviewId(item.id)}
              onMouseLeave={() => setPreviewId((cur) => (cur === item.id ? null : cur))}
              onClick={() => item.imageUrl && setPreviewId((cur) => (cur === item.id ? null : item.id))}
            >
              <AnimatePresence>
                {previewId === item.id && item.imageUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 14, scale: 0.85, rotate: -3 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotate: -2 }}
                    exit={{ opacity: 0, y: 10, scale: 0.85 }}
                    transition={{ type: "spring", stiffness: 320, damping: 24 }}
                    className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-3 w-36 -translate-x-1/2 sm:w-48"
                  >
                    <p className="mb-2 text-center font-serif text-base font-medium text-espresso sm:text-lg">
                      {item.name}
                    </p>
                    <div className="cloud-card overflow-hidden border-2 border-espresso bg-white">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="aspect-square w-full object-cover"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                className={cn(
                  "hard-card hard-card-hover flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5",
                  item.imageUrl && "cursor-pointer"
                )}
              >
                <div>
                  <p className="font-medium text-espresso">{item.name}</p>
                  {item.description && (
                    <p className="mt-1 text-sm text-stone-600">{item.description}</p>
                  )}
                </div>
                <p className="font-sans font-semibold text-espresso sm:shrink-0">
                  {formatPrice(item.price_cents)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
