"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cloud, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";

export function StaffValidateClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [data, setData] = useState<{
    customer_name: string;
    reward_name: string;
    points_required: number;
    current_balance: number;
  } | null>(null);
  const [loading, setLoading] = useState(!!token);
  const [error, setError] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("No redemption token in URL. Scan the customer's QR code.");
      setLoading(false);
      return;
    }
    fetch(`/api/staff/validate?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) {
          setError(json.error ?? "Invalid or expired token");
          setData(null);
        } else {
          setData(json);
          setError(null);
        }
      })
      .catch(() => setError("Something went wrong"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleValidate = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/staff/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Validation failed");
        return;
      }
      setValidated(true);
      setData(null);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-md space-y-6"
    >
      <div className="flex items-center justify-center gap-2">
        <Cloud className="h-8 w-8 text-sky-blue" />
        <span className="font-serif text-xl font-medium text-stone-800">Staff · Validate redemption</span>
      </div>

      {loading && !data && !error && (
        <GlassCard className="p-8 text-center text-stone-600">
          Loading…
        </GlassCard>
      )}

      {error && !data && (
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        </GlassCard>
      )}

      {validated && (
        <GlassCard className="p-6 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
          <p className="mt-2 font-medium text-stone-800">Redemption validated.</p>
          <p className="mt-1 text-sm text-stone-600">Points have been deducted.</p>
        </GlassCard>
      )}

      {data && !validated && (
        <GlassCard className="p-6 space-y-4">
          <p className="text-sm text-stone-600">Customer</p>
          <p className="font-medium text-stone-800">{data.customer_name || "—"}</p>
          <p className="text-sm text-stone-600">Reward</p>
          <p className="font-medium text-stone-800">{data.reward_name}</p>
          <p className="text-sm text-stone-600">Points required</p>
          <p className="font-medium text-stone-800">{data.points_required} pts</p>
          <p className="text-sm text-stone-600">Current balance</p>
          <p className="font-medium text-stone-800">{data.current_balance} pts</p>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button className="w-full" size="lg" onClick={handleValidate} disabled={loading}>
            {loading ? "Validating…" : "Validate redemption"}
          </Button>
        </GlassCard>
      )}

      {!token && (
        <p className="text-center text-sm text-stone-500">
          Scan the QR code on the customer&apos;s phone to validate their reward.
        </p>
      )}
    </motion.div>
  );
}
