"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";

export function MoodManageClient({ weekKey, initialMessage }: { weekKey: string; initialMessage: string }) {
  const [message, setMessage] = useState(initialMessage);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ week_key: weekKey, message: message.trim() }),
      });
      if (res.ok) setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="mt-6 max-w-xl p-6">
      <p className="text-sm text-stone-600">Week: {weekKey}</p>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="e.g. This week's Cloud9 mood: slow mornings, warm cups, soft conversations."
        rows={4}
        className="mt-2 w-full rounded-2xl border border-latte-beige bg-soft-white/80 px-4 py-3 font-sans text-stone-800 placeholder:text-stone-400 focus:border-sky-blue focus:outline-none focus:ring-2 focus:ring-sky-blue/20"
      />
      {success && <p className="mt-2 text-sm text-green-600">Saved.</p>}
      <Button className="mt-4" onClick={handleSave} disabled={loading}>
        {loading ? "Saving…" : "Save"}
      </Button>
    </GlassCard>
  );
}
