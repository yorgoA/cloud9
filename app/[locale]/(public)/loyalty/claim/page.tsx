import { Suspense } from "react";
import { LoyaltyClaimClient } from "./LoyaltyClaimClient";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function ClaimPage() {
  const t = await getTranslations("common");

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center text-stone-500">
            {t("loading")}
          </div>
        }
      >
        <LoyaltyClaimClient />
      </Suspense>
    </div>
  );
}
