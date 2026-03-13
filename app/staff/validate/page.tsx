import { Suspense } from "react";
import { StaffValidateClient } from "./StaffValidateClient";

export const dynamic = "force-dynamic";

export default function StaffValidatePage() {
  return (
    <div className="min-h-screen bg-cream px-4 py-8">
      <Suspense fallback={<div className="flex min-h-[40vh] items-center justify-center text-stone-500">Loading…</div>}>
        <StaffValidateClient />
      </Suspense>
    </div>
  );
}
