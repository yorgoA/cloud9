import { createClient } from "@/lib/supabase/server";
import type { MenuItem } from "@/lib/db/types";
import { getTranslations, getLocale } from "next-intl/server";
import { MenuTabs } from "./MenuTabs";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const GROUPS = [
  {
    label: "Hot",
    subs: [
      { dbCategory: "Hot Coffee", label: "Coffee" },
      { dbCategory: "Hot Latte & More", label: "Lattes" },
      { dbCategory: "Hot Matcha", label: "Matcha Bar" },
    ],
  },
  {
    label: "Cold",
    subs: [
      { dbCategory: "Iced Coffee", label: "Coffee" },
      { dbCategory: "Iced Latte & More", label: "Latte & More" },
      { dbCategory: "Iced Matcha", label: "Matcha Bar" },
      { dbCategory: "Cloud Series", label: "Cloud Series" },
      { dbCategory: "Softs", label: "Softs" },
    ],
  },
  {
    label: "Bakes",
    subs: [{ dbCategory: "Bakes", label: "Bakes" }],
  },
];

export default async function MenuPage() {
  const t = await getTranslations("menu");
  const locale = await getLocale();

  const supabase = await createClient();
  const { data: items } = await supabase
    .from("menu_items")
    .select("*")
    .eq("active", true)
    .order("category")
    .order("sort_order");

  const byCategory = (items ?? []).reduce<Record<string, MenuItem[]>>(
    (acc, item) => {
      const cat = item.category ?? "";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    },
    {}
  );

  const groups = GROUPS.map((group) => ({
    label: group.label,
    subs: group.subs
      .filter((sub) => byCategory[sub.dbCategory]?.length)
      .map((sub) => ({
        label: sub.label,
        items: byCategory[sub.dbCategory].map((item) => ({
          id: item.id,
          name: (locale === "fr" && item.name_fr) || item.name,
          description: (locale === "fr" && item.description_fr) || item.description,
          price_cents: item.price_cents,
        })),
      })),
  })).filter((group) => group.subs.length > 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <header className="text-center">
        <h1 className="font-serif text-4xl font-medium text-espresso sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 font-sans text-espresso">{t("subtitle")}</p>
      </header>

      <div className="mt-12">
        {groups.length === 0 ? (
          <div className="hard-card p-8 text-center text-stone-600">
            {t("updating")}
          </div>
        ) : (
          <MenuTabs groups={groups} />
        )}
      </div>
    </div>
  );
}
