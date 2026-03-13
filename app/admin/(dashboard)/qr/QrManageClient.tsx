"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";

export function QrManageClient({ weekKey, currentToken }: { weekKey: string; currentToken: string | null }) {
  const [token, setToken] = useState(currentToken);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ week_key: weekKey }),
      });
      const data = await res.json();
      if (data.token) setToken(data.token);
    } finally {
      setLoading(false);
    }
  };

  const base = typeof window !== "undefined" ? window.location.origin : "";
  const claimUrl = token ? `${base}/loyalty/claim?week=${weekKey}` : null;
  const qrImageUrl = token ? `${base}/api/qr?url=${encodeURIComponent(claimUrl!)}` : null;

  return (
    <div className="mt-6 space-y-6">
      <GlassCard className="p-6">
        <p className="text-sm text-stone-600">Week: {weekKey}</p>
        <Button className="mt-4" onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating…" : token ? "Regenerate weekly QR" : "Generate weekly QR"}
        </Button>
        {token && (
          <div className="mt-6">
            <p className="text-sm text-stone-600">In-store claim URL (use this for the QR):</p>
            <p className="mt-1 break-all font-mono text-sm text-stone-800">{claimUrl}</p>
            {qrImageUrl && (
              <div className="mt-4 flex justify-center rounded-2xl bg-white p-4">
                <img src={qrImageUrl} alt="Weekly QR" className="h-48 w-48 object-contain" />
              </div>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
