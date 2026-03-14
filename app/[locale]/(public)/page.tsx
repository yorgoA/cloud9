import { Cloud, Gift, MapPin, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { getWeekKey } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { Link as LocaleLink } from "@/i18n/navigation";
import { getSiteContact } from "@/lib/site-contact";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function HomePage() {
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");

  const supabase = await createClient();
  const contact = await getSiteContact(supabase);
  const weekKey = getWeekKey();
  const { data: mood } = await supabase
    .from("cloud9_moods")
    .select("message")
    .eq("week_key", weekKey)
    .single();

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 pt-16 pb-6 sm:px-6 sm:pt-24 sm:pb-8">
      <section className="space-y-3 text-center">
        <h1 className="font-serif text-4xl font-medium tracking-tight text-[#5D4037] sm:text-5xl">
          {tCommon("cloud9")}
        </h1>
        <p className="mx-auto mt-2 max-w-lg font-sans text-base text-stone-600">
          {t("tagline")}
        </p>
        <p className="mt-1 text-xs text-stone-500">
          {[contact.address_line1, contact.address_line2].filter(Boolean).join(" · ")}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Button asChild size="default" variant="coffee">
            <LocaleLink href="/menu">{t("seeMenu")}</LocaleLink>
          </Button>
          <Button asChild size="default" variant="coffee">
            <LocaleLink href="/concept">{t("ourStory")}</LocaleLink>
          </Button>
        </div>
      </section>

      {mood?.message && (
        <section className="mx-auto w-full max-w-xl">
          <GlassCard className="p-4 text-center" hover={false}>
            <div className="flex items-center justify-center gap-2">
              <Cloud className="h-6 w-6 text-sky-blue" />
              <p className="font-serif text-base font-medium text-stone-700">
                {t("moodTitle")}
              </p>
            </div>
            <p className="mt-1 text-sm text-stone-600 line-clamp-2">
              {mood.message}
            </p>
          </GlassCard>
        </section>
      )}

      <section className="grid gap-5 pt-16 sm:grid-cols-3">
        <GlassCard>
          <LocaleLink href="/menu" className="block p-5">
            <div className="flex items-center gap-2">
              <Coffee className="h-9 w-9 shrink-0 text-sky-blue" />
              <h2 className="font-serif text-lg font-semibold text-stone-800">
                {t("menuCardTitle")}
              </h2>
            </div>
            <p className="mt-1.5 text-sm font-medium text-stone-600">
              {t("menuCardDesc")}
            </p>
          </LocaleLink>
        </GlassCard>
        <GlassCard>
          <LocaleLink href="/loyalty" className="block p-5">
            <div className="flex items-center gap-2">
              <Gift className="h-9 w-9 shrink-0 text-sky-blue" />
              <h2 className="font-serif text-lg font-semibold text-stone-800">
                {t("loyaltyCardTitle")}
              </h2>
            </div>
            <p className="mt-1.5 text-sm font-medium text-stone-600">
              {t("loyaltyCardDesc")}
            </p>
          </LocaleLink>
        </GlassCard>
        <GlassCard>
          <LocaleLink href="/visit" className="block p-5">
            <div className="flex items-center gap-2">
              <MapPin className="h-9 w-9 shrink-0 text-sky-blue" />
              <h2 className="font-serif text-lg font-semibold text-stone-800">
                {t("visitCardTitle")}
              </h2>
            </div>
            <p className="mt-1.5 text-sm font-medium text-stone-600">
              {t("visitCardDesc")}
            </p>
          </LocaleLink>
        </GlassCard>
      </section>
    </div>
  );
}
