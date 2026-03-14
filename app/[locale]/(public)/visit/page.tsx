import { MapPin, Clock, Mail } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { getTranslations } from "next-intl/server";

const INSTAGRAM_URL = "https://instagram.com/cloud9";
const TIKTOK_URL = "https://tiktok.com/@cloud9";

export default async function VisitPage() {
  const t = await getTranslations("visit");

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
                {t("addressLine1")}
                <br />
                {t("addressLine2")}
                <br />
                {t("addressLine3")}
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
                  href="mailto:hello@cloud9.cafe"
                  className="hover:text-stone-800"
                >
                  hello@cloud9.cafe
                </a>
                <br />
                <a href="tel:+1234567890" className="hover:text-stone-800">
                  +1 234 567 890
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
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-stone-800"
                >
                  Instagram
                </a>
                <a
                  href={TIKTOK_URL}
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
