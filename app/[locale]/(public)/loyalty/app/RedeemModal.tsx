"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { RewardCatalog } from "@/lib/db/types";
import { useTranslations } from "next-intl";

interface RedeemModalProps {
  reward: RewardCatalog | null;
  pointsBalance: number;
  onClose: () => void;
  onRedeemed: () => void;
}

export function RedeemModal({
  reward,
  pointsBalance,
  onClose,
  onRedeemed,
}: RedeemModalProps) {
  const t = useTranslations("redeemModal");
  const tCommon = useTranslations("common");
  const [step, setStep] = useState<"confirm" | "qr" | "error">("confirm");
  const [loading, setLoading] = useState(false);
  const [redeemUrl, setRedeemUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const canRedeem = reward && pointsBalance >= reward.points_required;

  const handleRedeem = async () => {
    if (!reward || !canRedeem) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/loyalty/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reward_id: reward.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t("couldNotCreate"));
        setStep("error");
        return;
      }
      setRedeemUrl(data.redeem_url ?? null);
      setStep("qr");
    } catch {
      setError(t("couldNotCreate"));
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("confirm");
    setRedeemUrl(null);
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {reward && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/40 p-4 backdrop-blur-sm sm:items-center"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="w-full max-w-md rounded-3xl border border-white/60 bg-cream/95 p-6 shadow-soft backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-medium text-stone-800">
                {t("title")}
              </h3>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl p-2 text-stone-500 hover:bg-coffee-hover"
                aria-label={tCommon("close")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {step === "confirm" && (
              <>
                <p className="mt-2 font-medium text-stone-800">{reward.name}</p>
                {reward.description && (
                  <p className="mt-1 text-sm text-stone-600">
                    {reward.description}
                  </p>
                )}
                <p className="mt-2 text-sm text-stone-600">
                  {t("pointsBalance", { points: reward.points_required, balance: pointsBalance })}
                </p>
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
                <div className="mt-6 flex gap-3">
                  <Button variant="ghost" className="flex-1" onClick={handleClose}>
                    {tCommon("cancel")}
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleRedeem}
                    disabled={!canRedeem || loading}
                  >
                    {loading ? t("creating") : t("showQr")}
                  </Button>
                </div>
              </>
            )}

            {step === "qr" && redeemUrl && (
              <>
                <p className="mt-2 text-sm text-stone-600">{t("showQrNote")}</p>
                <div className="mt-4 flex justify-center rounded-2xl bg-white p-4">
                  <img
                    src={redeemUrl}
                    alt={t("redemptionQr")}
                    className="h-48 w-48 object-contain"
                  />
                </div>
                <p className="mt-2 text-center text-xs text-stone-500">
                  {t("validNote")}
                </p>
                <Button className="mt-4 w-full" onClick={handleClose}>
                  {tCommon("done")}
                </Button>
              </>
            )}

            {step === "error" && (
              <>
                <p className="mt-2 text-sm text-red-600">{error}</p>
                <Button className="mt-4 w-full" onClick={handleClose}>
                  {tCommon("close")}
                </Button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
