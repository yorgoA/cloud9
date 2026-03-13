import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import type { MenuItem } from "@/lib/db/types";

export const dynamic = "force-dynamic";
export const revalidate = 60;

function formatPrice(cents: number | null): string {
  if (cents == null) return "—";
  return `€${(cents / 100).toFixed(2)}`;
}

export default async function MenuPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("menu_items")
    .select("*")
    .eq("active", true)
    .order("category")
    .order("sort_order");

  const byCategory = (items ?? []).reduce<Record<string, MenuItem[]>>((acc, item) => {
    const cat = item.category ?? "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const categories = Object.keys(byCategory).sort();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <header className="text-center">
        <h1 className="font-serif text-4xl font-medium text-[#5D4037] sm:text-5xl">
          Menu
        </h1>
        <p className="mt-4 font-sans text-[#5D4037]">
          Our drinks and treats
        </p>
      </header>

      <div className="mt-16 space-y-12">
        {categories.length === 0 ? (
          <GlassCard className="p-8 text-center text-stone-600">
            Our menu is being updated. Check back soon.
          </GlassCard>
        ) : (
          categories.map((category) => (
            <section key={category}>
              <h2 className="font-serif text-2xl font-medium text-stone-800">{category}</h2>
              <div className="mt-4 space-y-3">
                {byCategory[category].map((item) => (
                  <GlassCard key={item.id} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div>
                      <p className="font-medium text-stone-800">{item.name}</p>
                      {item.description && (
                        <p className="mt-1 text-sm text-stone-600">{item.description}</p>
                      )}
                    </div>
                    <p className="font-sans font-medium text-stone-700 sm:shrink-0">
                      {formatPrice(item.price_cents)}
                    </p>
                  </GlassCard>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
