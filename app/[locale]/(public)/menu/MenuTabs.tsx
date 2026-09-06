"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface DisplayMenuItem {
  id: string;
  name: string;
  description: string | null;
  price_cents: number | null;
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

  const group = groups[activeGroup];
  const sub = group.subs[activeSub];

  return (
    <div>
      <div className="flex justify-center gap-3">
        {groups.map((g, i) => (
          <button
            key={g.label}
            type="button"
            onClick={() => {
              setActiveGroup(i);
              setActiveSub(0);
            }}
            className={cn(
              "rounded-full border-2 px-6 py-2.5 text-base font-bold uppercase tracking-wide transition-all",
              i === activeGroup
                ? "border-espresso bg-dusty-blue text-cream shadow-hard-sm"
                : "border-espresso/30 bg-cream text-espresso hover:border-espresso hover:bg-powder-blue/30"
            )}
          >
            {g.label}
          </button>
        ))}
      </div>

      {group.subs.length > 1 && (
        <div className="-mx-4 mt-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex w-max gap-2 sm:w-full sm:flex-wrap sm:justify-center">
            {group.subs.map((s, i) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setActiveSub(i)}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-all",
                  i === activeSub
                    ? "border-espresso text-espresso"
                    : "border-transparent text-stone-500 hover:text-espresso"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div key={`${activeGroup}-${activeSub}`} className="mt-8 space-y-3">
        {sub.items.map((item) => (
          <div
            key={item.id}
            className="hard-card flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
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
        ))}
      </div>
    </div>
  );
}
