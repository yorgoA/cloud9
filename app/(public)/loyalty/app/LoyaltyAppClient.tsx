"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Gift, LogOut, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { createClient } from "@/lib/supabase/client";
import type { Customer } from "@/lib/db/types";
import type { RewardCatalog } from "@/lib/db/types";
import { RedeemModal } from "./RedeemModal";

export function LoyaltyAppClient() {
  const supabase = createClient();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [rewards, setRewards] = useState<RewardCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeemReward, setRedeemReward] = useState<RewardCatalog | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/loyalty/claim/login?redirect=/loyalty/app";
        return;
      }
      const { data: c } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setCustomer(c ?? null);
      const { data: r } = await supabase
        .from("reward_catalog")
        .select("*")
        .eq("active", true)
        .order("sort_order");
      setRewards(r ?? []);
      setLoading(false);
    };
    load();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/loyalty";
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-sky-blue/30" />
      </div>
    );
  }

  if (!customer) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-stone-600">Loading your account…</p>
        <Button asChild variant="coffee" className="mt-4">
          <Link href="/loyalty/claim/login?redirect=/loyalty/app">Sign in</Link>
        </Button>
      </GlassCard>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="h-8 w-8 text-sky-blue" />
            <span className="font-serif text-xl font-medium text-stone-800">Cloud9 Loyalty</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign out">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        <GlassCard className="p-6">
          <p className="text-sm text-stone-600">Your balance</p>
          <p className="mt-1 font-serif text-4xl font-medium text-stone-800">
            {customer.points_balance} <span className="text-lg font-sans font-normal text-stone-500">pts</span>
          </p>
          <Link href="/loyalty/claim">
            <Button className="mt-4 w-full" size="lg" variant="coffee">
              <Star className="h-5 w-5" />
              Claim today&apos;s visit
            </Button>
          </Link>
        </GlassCard>

        <div>
          <h2 className="font-serif text-lg font-medium text-stone-800">Rewards</h2>
          <p className="mt-1 text-sm text-stone-600">Redeem your points in the café</p>
          <div className="mt-4 space-y-3">
            <AnimatePresence>
              {rewards.map((reward, i) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GlassCard
                    className="flex cursor-pointer items-center justify-between p-4 transition-shadow hover:shadow-glass"
                    onClick={() => setRedeemReward(reward)}
                  >
                    <div className="flex items-center gap-3">
                      <Gift className="h-8 w-8 text-sky-blue" />
                      <div>
                        <p className="font-medium text-stone-800">{reward.name}</p>
                        {reward.description && (
                          <p className="text-sm text-stone-600">{reward.description}</p>
                        )}
                      </div>
                    </div>
                    <p className="font-sans font-medium text-stone-700">{reward.points_required} pts</p>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <RedeemModal
        reward={redeemReward}
        pointsBalance={customer.points_balance}
        onClose={() => setRedeemReward(null)}
        onRedeemed={() => setRedeemReward(null)}
      />
    </>
  );
}
