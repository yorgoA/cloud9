"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatDate } from "@/lib/utils";

type Customer = { id: string; name: string | null; email: string | null; points_balance: number; created_at: string };

export function LoyaltyManageClient({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [customers] = useState(initialCustomers);
  const [adjusting, setAdjusting] = useState<string | null>(null);

  const handleAdjust = async (id: string, delta: number) => {
    setAdjusting(id);
    await fetch("/api/admin/loyalty", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id: id, points_delta: delta }),
    });
    setAdjusting(null);
    window.location.reload();
  };

  return (
    <div className="mt-6 space-y-4">
      {customers.map((c) => (
        <GlassCard key={c.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
          <div>
            <p className="font-medium text-stone-800">{c.name || c.email || "—"}</p>
            {c.email && <p className="text-sm text-stone-600">{c.email}</p>}
            <p className="text-xs text-stone-500">Joined {formatDate(c.created_at)}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-stone-800">{c.points_balance} pts</span>
            <button
              type="button"
              className="rounded-lg bg-cloud-200 px-2 py-1 text-sm hover:bg-coffee-hover"
              onClick={() => handleAdjust(c.id, 100)}
              disabled={!!adjusting}
            >
              +100
            </button>
            <button
              type="button"
              className="rounded-lg bg-cloud-200 px-2 py-1 text-sm hover:bg-coffee-hover"
              onClick={() => handleAdjust(c.id, -100)}
              disabled={!!adjusting}
            >
              -100
            </button>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
