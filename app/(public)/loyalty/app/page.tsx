import { LoyaltyAppClient } from "./LoyaltyAppClient";

export const dynamic = "force-dynamic";

export default function LoyaltyAppPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:py-12">
      <LoyaltyAppClient />
    </div>
  );
}
