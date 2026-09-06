import { Gift, QrCode, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function LoyaltyIntroPage() {
  const t = await getTranslations("loyalty");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <header className="text-center">
        <h1 className="font-serif text-4xl font-medium text-espresso sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 font-sans text-espresso">{t("subtitle")}</p>
      </header>

      <div className="mt-16 space-y-6">
        <div className="hard-card p-6 sm:p-10">
          <div className="flex items-start gap-4">
            <div className="badge-icon bg-powder-blue">
              <Star className="h-7 w-7 text-espresso" strokeWidth={2} />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-espresso">
                {t("howItWorksTitle")}
              </h2>
              <p className="mt-2 font-sans text-stone-600">
                {t("howItWorksText")}
              </p>
            </div>
          </div>
        </div>

        <div className="hard-card p-6 sm:p-10">
          <div className="flex items-start gap-4">
            <div className="badge-icon bg-sand">
              <Gift className="h-7 w-7 text-espresso" strokeWidth={2} />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-espresso">
                {t("rewardsTitle")}
              </h2>
              <p className="mt-2 font-sans text-stone-600">
                {t("rewardsText")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button asChild size="lg" variant="bold">
            <Link href="/loyalty/claim" className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              {t("claimButton")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
