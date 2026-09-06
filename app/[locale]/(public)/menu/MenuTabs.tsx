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

const TILE_SHAPES = ["cloud-tile-1", "cloud-tile-2", "cloud-tile-3"];

function formatPrice(cents: number | null): string {
  if (cents == null) return "—";
  return `€${(cents / 100).toFixed(2)}`;
}

export function MenuTabs({ groups }: { groups: MenuGroup[] }) {
  const [activeGroup, setActiveGroup] = useState(0);
  const [activeSub, setActiveSub] = useState(0);
  const [revealedId, setRevealedId] = useState<string | null>(null);

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
              setRevealedId(null);
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
                  setRevealedId(null);
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
          className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {sub.items.map((item, i) => {
            const revealed = revealedId === item.id && !!item.imageUrl;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 8) * 0.04, duration: 0.35, ease: "easeOut" }}
                onMouseEnter={() => item.imageUrl && setRevealedId(item.id)}
                onMouseLeave={() => setRevealedId((cur) => (cur === item.id ? null : cur))}
                onClick={() => item.imageUrl && setRevealedId((cur) => (cur === item.id ? null : item.id))}
                className={cn(
                  "relative min-h-[220px] overflow-hidden border-2 border-espresso bg-cream shadow-hard transition-transform duration-200",
                  TILE_SHAPES[i % TILE_SHAPES.length],
                  item.imageUrl && "cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg"
                )}
              >
                <motion.div
                  animate={{ opacity: revealed ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-white to-powder-blue/30 p-5 text-center"
                >
                  <p className="font-serif text-lg font-medium text-espresso">{item.name}</p>
                  {item.description && (
                    <p className="line-clamp-4 text-sm text-stone-600">{item.description}</p>
                  )}
                  <p className="mt-1 font-sans font-semibold text-espresso">
                    {formatPrice(item.price_cents)}
                  </p>
                </motion.div>

                {item.imageUrl && (
                  <motion.img
                    src={item.imageUrl}
                    alt={item.name}
                    animate={{ opacity: revealed ? 1 : 0, scale: revealed ? 1 : 1.06 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
