import Image from "next/image";
import { Cloud, Gift, MapPin, Coffee } from "lucide-react";
import { MenuShowcase } from "@/components/three/MenuShowcase";
import { getWeekKey } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { Link as LocaleLink } from "@/i18n/navigation";
import { getSiteContact } from "@/lib/site-contact";

const featureCards = [
  { href: "/menu" as const, icon: Coffee, titleKey: "menuCardTitle" as const, descKey: "menuCardDesc" as const, bg: "bg-powder-blue" },
  { href: "/loyalty" as const, icon: Gift, titleKey: "loyaltyCardTitle" as const, descKey: "loyaltyCardDesc" as const, bg: "bg-sand" },
  { href: "/visit" as const, icon: MapPin, titleKey: "visitCardTitle" as const, descKey: "visitCardDesc" as const, bg: "bg-dusty-blue" },
];

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function HomePage() {
  const t = await getTranslations("home");

  const supabase = await createClient();
  const contact = await getSiteContact(supabase);
  const weekKey = getWeekKey();
  const { data: mood } = await supabase
    .from("cloud9_moods")
    .select("message")
    .eq("week_key", weekKey)
    .single();

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pt-14 pb-10 sm:px-6 sm:pt-20 sm:pb-14">
      <section className="relative grid items-center gap-6 overflow-visible text-center sm:grid-cols-[1fr_auto_1fr] sm:text-left">
        <div className="hidden sm:block" aria-hidden />
        <div className="space-y-4">
          <Image
            src="/brand/logo-blue.png"
            alt="Cloud9"
            width={320}
            height={218}
            priority
            className="mx-auto h-24 w-auto sm:mx-0 sm:h-28"
          />
          <p className="mx-auto max-w-md font-sans text-base text-stone-600 sm:mx-0">
            {t("tagline")}
          </p>
          <p className="text-xs font-medium text-stone-500">
            {[contact.address_line1, contact.address_line2, contact.address_line3]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        <Image
          src="/brand/mascot-blue.png"
          alt=""
          width={220}
          height={244}
          priority
          className="mx-auto h-40 w-auto sm:h-52"
        />
      </section>

      {mood?.message && (
        <section className="mx-auto w-full max-w-xl">
          <div className="hard-card p-5 text-center">
            <div className="flex items-center justify-center gap-2">
              <Cloud className="h-6 w-6 text-dusty-blue" />
              <p className="font-serif text-base font-semibold text-espresso">
                {t("moodTitle")}
              </p>
            </div>
            <p className="mt-1 text-sm text-stone-600 line-clamp-2">
              {mood.message}
            </p>
          </div>
        </section>
      )}

      <section className="grid gap-6 pt-10 sm:grid-cols-3">
        {featureCards.map(({ href, icon: Icon, titleKey, descKey, bg }) => (
          <LocaleLink
            key={href}
            href={href}
            className="hard-card hard-card-hover block p-6"
          >
            <div className={`badge-icon ${bg}`}>
              <Icon className="h-7 w-7 text-espresso" strokeWidth={2} />
            </div>
            <h2 className="mt-4 font-serif text-xl font-semibold text-espresso">
              {t(titleKey)}
            </h2>
            <p className="mt-1.5 text-sm font-medium text-stone-600">
              {t(descKey)}
            </p>
          </LocaleLink>
        ))}
      </section>

      <MenuShowcase />
    </div>
  );
}
