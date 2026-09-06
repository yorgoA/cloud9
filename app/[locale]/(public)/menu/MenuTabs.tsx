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

function CloudTab({
  label,
  active,
  onClick,
  size = "lg",
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  size?: "lg" | "sm";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex shrink-0 items-center justify-center transition-transform hover:-translate-y-0.5",
        size === "lg" ? "h-16 w-28 sm:h-20 sm:w-36" : "h-12 w-24 sm:h-14 sm:w-28"
      )}
    >
      <img
        src="/brand/cloud-beige.png"
        alt=""
        className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_3px_8px_rgba(0,0,0,0.12)]"
      />
      <motion.img
        src="/brand/cloud-fill.png"
        alt=""
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_3px_8px_rgba(0,0,0,0.12)]"
      />
      <span
        className={cn(
          "relative font-bold uppercase tracking-wide transition-colors",
          size === "lg" ? "text-sm sm:text-base" : "text-xs sm:text-sm",
          active ? "text-espresso" : "text-espresso/60"
        )}
      >
        {label}
      </span>
    </button>
  );
}

export function MenuTabs({ groups }: { groups: MenuGroup[] }) {
  const [activeGroup, setActiveGroup] = useState(0);
  const [activeSub, setActiveSub] = useState(0);

  const group = groups[activeGroup];
  const sub = group.subs[activeSub];

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-1 sm:gap-3">
        {groups.map((g, i) => (
          <CloudTab
            key={g.label}
            label={g.label}
            active={i === activeGroup}
            onClick={() => {
              setActiveGroup(i);
              setActiveSub(0);
            }}
          />
        ))}
      </div>

      {group.subs.length > 1 && (
        <div className="-mx-4 mt-2 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
          <div className="flex w-max gap-1 sm:w-full sm:flex-wrap sm:justify-center">
            {group.subs.map((s, i) => (
              <CloudTab
                key={s.label}
                label={s.label}
                active={i === activeSub}
                onClick={() => setActiveSub(i)}
                size="sm"
              />
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
          {sub.items.map((item) => (
            <div
              key={item.id}
              className="hard-card hard-card-hover flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              <div>
                <p className="font-medium text-espresso">{item.name}</p>
                {item.description && (
                  <p className="mt-1 text-sm text-stone-600">{item.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3 sm:shrink-0">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-16 w-16 rounded-2xl border-2 border-espresso object-cover sm:h-20 sm:w-20"
                  />
                )}
                <p className="font-sans font-semibold text-espresso">
                  {formatPrice(item.price_cents)}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
