"use client";

import { useState } from "react";
import Image from "next/image";
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
        "relative inline-flex shrink-0 items-center justify-center transition-transform hover:-translate-y-0.5",
        size === "lg"
          ? "min-h-[64px] px-8 py-4 sm:min-h-[76px] sm:px-9"
          : "min-h-[48px] px-6 py-3 sm:min-h-[56px] sm:px-7"
      )}
    >
      <Image
        src="/brand/cloud-beige-tab.png"
        alt=""
        fill
        sizes="200px"
        className="object-fill drop-shadow-[0_3px_8px_rgba(0,0,0,0.12)]"
      />
      <motion.img
        src="/brand/cloud-fill-tab.png"
        alt=""
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 h-full w-full object-fill drop-shadow-[0_3px_8px_rgba(0,0,0,0.12)]"
      />
      <span
        className={cn(
          "relative whitespace-nowrap font-bold uppercase tracking-wide transition-colors",
          size === "lg" ? "text-sm sm:text-base" : "text-xs sm:text-sm",
          active ? "text-espresso" : "text-espresso/60"
        )}
      >
        {label}
      </span>
    </button>
  );
}

function SubTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative rounded-full border-2 px-5 py-2 text-xs font-bold uppercase tracking-wide transition-all sm:text-sm",
        active
          ? "border-espresso bg-dusty-blue text-cream shadow-hard-sm"
          : "border-espresso/25 bg-transparent text-espresso/60 hover:border-espresso/60 hover:text-espresso"
      )}
    >
      {label}
    </button>
  );
}

export function MenuTabs({ groups }: { groups: MenuGroup[] }) {
  // Open on the first group + first subcategory so visitors land on a populated menu
  const [activeGroup, setActiveGroup] = useState(0);
  const [activeSub, setActiveSub] = useState(0);

  const group = groups[activeGroup] ?? null;
  const sub = group?.subs[activeSub] ?? null;

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
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

      {group && group.subs.length > 1 && (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {group.subs.map((s, i) => (
            <SubTab
              key={s.label}
              label={s.label}
              active={i === activeSub}
              onClick={() => setActiveSub(i)}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {sub && (
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
                className="hard-card hard-card-hover flex items-center justify-between gap-3 p-4 sm:p-5"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-espresso">{item.name}</p>
                  {item.description && (
                    <p className="mt-1 text-sm text-stone-600">{item.description}</p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-center gap-1.5 sm:flex-row sm:gap-3">
                  {item.imageUrl && (
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-espresso sm:h-20 sm:w-20">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <p className="font-sans font-semibold text-espresso">
                    {formatPrice(item.price_cents)}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
