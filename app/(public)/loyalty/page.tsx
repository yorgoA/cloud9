import Link from "next/link";
import { Gift, QrCode, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";

export default function LoyaltyIntroPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <header className="text-center">
        <h1 className="font-serif text-4xl font-medium text-[#5D4037] sm:text-5xl">
          Loyalty
        </h1>
        <p className="mt-4 font-sans text-[#5D4037]">
          Collect points. Redeem rewards. Feel the love.
        </p>
      </header>

      <div className="mt-16 space-y-8">
        <GlassCard className="p-6 sm:p-10">
          <div className="flex items-start gap-4">
            <Star className="h-10 w-10 shrink-0 text-sky-blue" />
            <div>
              <h2 className="font-serif text-xl font-medium text-stone-800">How it works</h2>
              <p className="mt-2 font-sans text-stone-600">
                Visit us in the café, scan the QR code at the counter, enter the daily code you see
                in-store, and claim your points. One claim per day—so every visit counts.
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 sm:p-10">
          <div className="flex items-start gap-4">
            <Gift className="h-10 w-10 shrink-0 text-sky-blue" />
            <div>
              <h2 className="font-serif text-xl font-medium text-stone-800">Rewards</h2>
              <p className="mt-2 font-sans text-stone-600">
                Save up your points and redeem them for discounts, small souvenirs, or a free
                signature drink. Your balance never expires.
              </p>
            </div>
          </div>
        </GlassCard>

        <div className="flex justify-center">
          <Button asChild size="lg" variant="coffee">
            <Link href="/loyalty/claim" className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Claim visit / Open loyalty app
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
