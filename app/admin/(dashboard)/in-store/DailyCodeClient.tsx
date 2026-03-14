"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { generateRandomCode } from "@/lib/utils";

export function DailyCodeClient({ initialCode }: { initialCode: string | null }) {
  const [code, setCode] = useState(initialCode ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<"success" | "error" | null>(null);

  const handleSave = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/daily-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      });
      if (!res.ok) {
        setMessage("error");
        return;
      }
      setMessage("success");
    } catch {
      setMessage("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="max-w-md p-6 print:hidden">
      <p className="text-sm text-stone-600">Daily code (shown in café)</p>
      <div className="mt-2 flex items-center gap-3">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="e.g. CLOUD9"
          className="flex-1 rounded-2xl border border-latte-beige bg-soft-white/80 px-4 py-3 font-mono text-lg focus:border-sky-blue focus:outline-none focus:ring-2 focus:ring-sky-blue/20"
          maxLength={12}
        />
        <Button variant="secondary" onClick={() => setCode(generateRandomCode(6))}>
          Random
        </Button>
      </div>
      {message === "success" && <p className="mt-2 text-sm text-green-600">Code updated.</p>}
      {message === "error" && <p className="mt-2 text-sm text-red-600">Failed to update.</p>}
      <Button className="mt-4" onClick={handleSave} disabled={loading || !code.trim()}>
        {loading ? "Saving…" : "Save code"}
      </Button>
    </GlassCard>
  );
}
