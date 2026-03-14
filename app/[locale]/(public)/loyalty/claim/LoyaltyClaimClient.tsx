"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cloud, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function LoyaltyClaimClient() {
  const t = useTranslations("loyaltyClaim");
  const router = useRouter();
  const searchParams = useSearchParams();
  const weekKey = searchParams.get("week");
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const client = createClient();
    client.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setAuthChecked(true);
    });
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const loginUrl = `/loyalty/claim/login?redirect=/loyalty/claim${
    weekKey ? `?week=${weekKey}` : ""
  }`;

  const handleClaim = async () => {
    setError(null);
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(loginUrl);
        return;
      }

      const res = await fetch("/api/loyalty/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          week_key: weekKey || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? t("somethingWrong"));
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/loyalty/app"), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    router.push(loginUrl);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <Cloud className="mx-auto h-12 w-12 text-sky-blue" />
        <h1 className="mt-4 font-serif text-2xl font-medium text-stone-800">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-stone-600">{t("subtitle")}</p>
      </div>

      {success ? (
        <GlassCard className="p-8 text-center">
          <p className="font-medium text-stone-800">{t("pointsAdded")}</p>
          <p className="mt-2 text-sm text-stone-600">{t("redirecting")}</p>
        </GlassCard>
      ) : (
        <GlassCard className="p-6">
          <label className="block text-sm font-medium text-stone-700">
            {t("dailyCode")}
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t("codePlaceholder")}
            className="mt-2 w-full rounded-2xl border border-latte-beige bg-soft-white/80 px-4 py-3 font-sans text-stone-800 placeholder:text-stone-400 focus:border-sky-blue focus:outline-none focus:ring-2 focus:ring-sky-blue/20"
            maxLength={12}
            autoCapitalize="characters"
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
          <Button
            className="mt-4 w-full"
            size="lg"
            variant="coffee"
            onClick={handleClaim}
            disabled={loading || !code.trim()}
          >
            {loading ? t("claiming") : t("claimPoints")}
          </Button>
          {authChecked && !user && (
            <Button
              variant="coffee"
              className="mt-3 w-full"
              onClick={handleSignIn}
            >
              {t("signInFirst")}
            </Button>
          )}
        </GlassCard>
      )}

      <p className="text-center text-xs text-stone-500">
        {t("oneClaimNote")} <br />
        <QrCode className="mx-auto mt-1 inline h-4 w-4" /> {t("scanNote")}
      </p>
    </motion.div>
  );
}
