"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const newLocale = locale === "en" ? "fr" : "en";
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <button
      type="button"
      onClick={switchLocale}
      className="rounded-xl px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-coffee-hover/80 hover:text-stone-800"
      aria-label={locale === "en" ? "Passer en français" : "Switch to English"}
    >
      {locale === "en" ? "FR" : "EN"}
    </button>
  );
}
