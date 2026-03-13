import { Suspense } from "react";
import { LoyaltyClaimClient } from "./LoyaltyClaimClient";

export const dynamic = "force-dynamic";

export default function ClaimPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <Suspense fallback={<div className="flex min-h-[40vh] items-center justify-center text-stone-500">Loading…</div>}>
        <LoyaltyClaimClient />
      </Suspense>
    </div>
  );
}
