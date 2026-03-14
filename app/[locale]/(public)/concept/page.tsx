import { GlassCard } from "@/components/ui/GlassCard";
import { getTranslations } from "next-intl/server";

export default async function ConceptPage() {
  const t = await getTranslations("concept");

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
          <h2 className="font-serif text-2xl font-medium text-stone-800">
            {t("storyTitle")}
          </h2>
          <p className="mt-4 font-sans leading-relaxed text-stone-600">
            {t("storyText")}
          </p>
        </GlassCard>

        <GlassCard className="p-6 sm:p-10">
          <h2 className="font-serif text-2xl font-medium text-stone-800">
            {t("cafeTitle")}
          </h2>
          <p className="mt-4 font-sans leading-relaxed text-stone-600">
            {t("cafeText")}
          </p>
        </GlassCard>

        <GlassCard className="p-6 sm:p-10">
          <h2 className="font-serif text-2xl font-medium text-stone-800">
            {t("coffeeTitle")}
          </h2>
          <p className="mt-4 font-sans leading-relaxed text-stone-600">
            {t("coffeeText")}
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
