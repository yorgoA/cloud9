import { LoyaltyLoginClient } from "./LoyaltyLoginClient";

export const dynamic = "force-dynamic";

export default function LoyaltyLoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <LoyaltyLoginClient />
    </div>
  );
}
