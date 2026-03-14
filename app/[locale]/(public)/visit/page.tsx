import { MapPin, Clock, Mail } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getSiteContact } from "@/lib/site-contact";

export default async function VisitPage() {
  const t = await getTranslations("visit");
  const supabase = await createClient();
  const contact = await getSiteContact(supabase);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <header className="text-center">
        <h1 className="font-serif text-4xl font-medium text-[#5D4037] sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 font-sans text-[#5D4037]">{t("subtitle")}</p>
      </header>

      <div className="mt-16 space-y-8">
        <GlassCard className="p-6 sm:p-10">
          <div className="flex items-start gap-4">
            <MapPin className="h-8 w-8 shrink-0 text-sky-blue" />
            <div>
              <h2 className="font-serif text-xl font-medium text-stone-800">
                {t("addressTitle")}
              </h2>
              <p className="mt-2 font-sans text-stone-600">
                {contact.address_line1}
                <br />
                {contact.address_line2}
                <br />
                {contact.address_line3}
              </p>
              <p className="mt-2 text-sm text-stone-500">{t("addressNote")}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 sm:p-10">
          <div className="flex items-start gap-4">
            <Clock className="h-8 w-8 shrink-0 text-sky-blue" />
            <div>
              <h2 className="font-serif text-xl font-medium text-stone-800">
                {t("hoursTitle")}
              </h2>
              <p className="mt-2 font-sans text-stone-600">
                {t("hoursWeekday")}
                <br />
                {t("hoursWeekend")}
              </p>
              <p className="mt-2 text-sm text-stone-500">{t("hoursNote")}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 sm:p-10">
          <div className="flex items-start gap-4">
            <Mail className="h-8 w-8 shrink-0 text-sky-blue" />
            <div>
              <h2 className="font-serif text-xl font-medium text-stone-800">
                {t("contactTitle")}
              </h2>
              <p className="mt-2 font-sans text-stone-600">
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-stone-800"
                >
                  {contact.email}
                </a>
                <br />
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="hover:text-stone-800">
                  {contact.phone}
                </a>
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 sm:p-10">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-200 text-stone-600">
              <span className="text-xs font-medium">@</span>
            </div>
            <div>
              <h2 className="font-serif text-xl font-medium text-stone-800">
                {t("followTitle")}
              </h2>
              <p className="mt-2 flex flex-wrap gap-4 font-sans text-stone-600">
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-stone-800"
                >
                  Instagram
                </a>
                <a
                  href={contact.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-stone-800"
                >
                  TikTok
                </a>
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
