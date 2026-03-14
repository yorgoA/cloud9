"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function LoyaltyLoginClient() {
  const t = useTranslations("loyaltyLogin");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/loyalty/app";
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signedUp, setSignedUp] = useState(false);
  const supabase = createClient();

  const switchToSignUp = () => {
    setMode("signup");
    setError(null);
    setConfirmPassword("");
  };

  const switchToSignIn = () => {
    setMode("signin");
    setError(null);
    setConfirmPassword("");
  };

  const handleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error: e } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (e) {
        setError(e.message);
        return;
      }
      router.push(redirect);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim()) {
      setError(t("enterEmailPassword"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("passwordsMismatch"));
      return;
    }
    if (password.length < 6) {
      setError(t("passwordLength"));
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { error: e } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`,
        },
      });
      if (e) {
        setError(e.message);
        return;
      }
      setSignedUp(true);
      setMode("signin");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } finally {
      setLoading(false);
    }
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

      <GlassCard className="p-6">
        <label className="block text-sm font-medium text-stone-700">
          {t("email")}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-2 w-full rounded-2xl border border-latte-beige bg-soft-white/80 px-4 py-3 font-sans text-stone-800 placeholder:text-stone-400 focus:border-sky-blue focus:outline-none focus:ring-2 focus:ring-sky-blue/20"
        />
        <label className="mt-4 block text-sm font-medium text-stone-700">
          {t("password")}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="mt-2 w-full rounded-2xl border border-latte-beige bg-soft-white/80 px-4 py-3 font-sans text-stone-800 placeholder:text-stone-400 focus:border-sky-blue focus:outline-none focus:ring-2 focus:ring-sky-blue/20"
        />
        <AnimatePresence mode="wait">
          {mode === "signup" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <label className="mt-4 block text-sm font-medium text-stone-700">
                {t("confirmPassword")}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 w-full rounded-2xl border border-latte-beige bg-soft-white/80 px-4 py-3 font-sans text-stone-800 placeholder:text-stone-400 focus:border-sky-blue focus:outline-none focus:ring-2 focus:ring-sky-blue/20"
              />
            </motion.div>
          )}
        </AnimatePresence>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        {signedUp && (
          <p className="mt-2 text-sm text-emerald-600">{t("checkEmail")}</p>
        )}
        {mode === "signin" ? (
          <div className="mt-4 flex flex-col gap-2">
            <Button
              className="w-full"
              size="lg"
              variant="coffee"
              onClick={handleSignIn}
              disabled={loading || !email.trim() || !password.trim()}
            >
              {loading ? t("signingIn") : t("signIn")}
            </Button>
            <button
              type="button"
              onClick={switchToSignUp}
              className="rounded-2xl border border-latte-beige bg-soft-white/50 px-4 py-3 text-sm font-medium text-stone-600 transition-colors hover:bg-cloud-200/80 hover:text-stone-800"
            >
              {t("newUser")}
            </button>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            <Button
              className="w-full"
              size="lg"
              variant="coffee"
              onClick={handleSignUp}
              disabled={
                loading ||
                !email.trim() ||
                !password.trim() ||
                !confirmPassword.trim()
              }
            >
              {loading ? t("creatingAccount") : t("createAccount")}
            </Button>
            <button
              type="button"
              onClick={switchToSignIn}
              className="text-sm text-stone-600 hover:text-stone-800"
            >
              {t("existingUser")}
            </button>
          </div>
        )}
      </GlassCard>

      <p className="text-center text-sm text-stone-500">
        <Link href="/loyalty" className="text-sky-blue hover:underline">
          {tCommon("backToLoyalty")}
        </Link>
      </p>
    </motion.div>
  );
}
