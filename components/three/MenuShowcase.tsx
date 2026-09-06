"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link as LocaleLink } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { SpinningCup } from "@/components/three/SpinningCupClient";
import type { CupTexture } from "@/components/three/SpinningCup";
import { cn } from "@/lib/utils";

const CATEGORIES: { key: string; texture: CupTexture }[] = [
  {
    key: "cloud",
    texture: { type: "photo", src: "/brand/cup-cloud.png" },
  },
  {
    key: "matcha",
    texture: { type: "photo", src: "/brand/cup-photo.png" },
  },
  {
    key: "latte",
    texture: { type: "photo", src: "/brand/cup-latte.png" },
  },
];

export function MenuShowcase() {
  const t = useTranslations("home");
  const [active, setActive] = useState(0);

  return (
    <section className="hard-card grid items-center gap-6 overflow-hidden bg-dusty-blue/10 p-6 sm:grid-cols-2 sm:p-10">
      <div>
        <div className="space-y-2">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.key}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={cn(
                "flex w-full items-center gap-2 text-left font-serif text-3xl font-semibold transition-colors duration-200 sm:text-4xl",
                i === active ? "text-dusty-blue" : "text-espresso/50 hover:text-espresso"
              )}
            >
              {t(`menuShowcase.${cat.key}.name`)}
              <span
                className={cn(
                  "transition-opacity duration-200",
                  i === active ? "opacity-100" : "opacity-0"
                )}
              >
                →
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 min-h-[2.5rem] max-w-sm">
          <AnimatePresence mode="wait">
            <motion.p
              key={CATEGORIES[active].key}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="text-sm font-medium text-stone-600"
            >
              {t(`menuShowcase.${CATEGORIES[active].key}.desc`)}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="pt-4">
          <Button asChild size="default" variant="bold">
            <LocaleLink href="/menu">{t("seeMenu")}</LocaleLink>
          </Button>
        </div>
      </div>
      <SpinningCup texture={CATEGORIES[active].texture} className="h-64 w-full sm:h-80" />
    </section>
  );
}
