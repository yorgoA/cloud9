"use client";

import { useState, useMemo } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";

function formatWeekLabel(weekKey: string): string {
  const monday = new Date(weekKey + "T12:00:00");
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return `${fmt(monday)} – ${fmt(sunday)}`;
}

export function QrManageClient({ weekKey, currentToken }: { weekKey: string; currentToken: string | null }) {
  const [token, setToken] = useState(currentToken);
  const [loading, setLoading] = useState(false);
  const weekLabel = useMemo(() => formatWeekLabel(weekKey), [weekKey]);

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

  const handlePrint = () => window.print();

  const base = typeof window !== "undefined" ? window.location.origin : "";
  const claimUrl = token ? `${base}/loyalty/claim?week=${weekKey}` : null;
  const qrImageUrl = token ? `${base}/api/qr?url=${encodeURIComponent(claimUrl!)}` : null;

  return (
    <div className="mt-6 space-y-6 print:mt-0 print:space-y-0">
      <GlassCard className="p-6 print:border-0 print:bg-transparent print:shadow-none print:p-0 print:[filter:none]">
        <p className="text-sm text-stone-600 print:hidden">Week: {weekKey}</p>
        <div className="mt-4 flex flex-wrap gap-3 print:hidden">
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating…" : token ? "Regenerate weekly QR" : "Generate weekly QR"}
          </Button>
          {token && (
            <Button variant="secondary" onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" />
              Print QR
            </Button>
          )}
        </div>
        {token && (
          <div className="mt-6 print:mt-0 print:flex print:flex-col print:items-center print:justify-center print:[page-break-inside:avoid]">
            <p className="text-sm text-stone-600 print:hidden">In-store claim URL (use this for the QR):</p>
            <p className="mt-1 break-all font-mono text-sm text-stone-800 print:hidden">{claimUrl}</p>
            {qrImageUrl && (
              <div className="mt-4 flex flex-col items-center justify-center rounded-2xl bg-white p-4 print:mt-0 print:rounded-none print:bg-white print:p-6 print:break-inside-avoid">
                <img
                  src={qrImageUrl}
                  alt="Cloud9 QR"
                  className="h-48 w-48 object-contain print:h-64 print:w-64"
                />
                <p className="mt-4 font-serif text-lg font-semibold text-stone-800 print:mt-4 print:text-xl">
                  {weekLabel} CLOUD9 QR
                </p>
              </div>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
