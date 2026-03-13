"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import type { RewardCatalog } from "@/lib/db/types";

export function RewardsManageClient({ initialRewards }: { initialRewards: RewardCatalog[] }) {
  const [rewards, setRewards] = useState(initialRewards);

  const handleSave = async (r: RewardCatalog) => {
    await fetch("/api/admin/rewards", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: r.id,
        name: r.name,
        description: r.description,
        points_required: r.points_required,
        sort_order: r.sort_order,
        active: r.active,
      }),
    });
  };

  const handleAdd = async () => {
    const res = await fetch("/api/admin/rewards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "New reward", points_required: 500, sort_order: rewards.length }),
    });
    const data = await res.json();
    if (data.id)
      setRewards((prev) => [
        ...prev,
        {
          id: data.id,
          name: "New reward",
          description: null,
          points_required: 500,
          sort_order: rewards.length,
          active: true,
          created_at: "",
          updated_at: "",
        },
      ]);
  };

  return (
    <div className="mt-6 space-y-4">
      <Button onClick={handleAdd}>Add reward</Button>
      {rewards.map((r) => (
        <GlassCard key={r.id} className="p-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              className="rounded-xl border border-latte-beige bg-white px-3 py-2 text-sm"
              value={r.name}
              onChange={(e) => setRewards((prev) => prev.map((x) => (x.id === r.id ? { ...x, name: e.target.value } : x)))}
            />
            <input
              type="number"
              className="rounded-xl border border-latte-beige bg-white px-3 py-2 text-sm"
              value={r.points_required}
              onChange={(e) => setRewards((prev) => prev.map((x) => (x.id === r.id ? { ...x, points_required: parseInt(e.target.value, 10) || 0 } : x)))}
            />
            <input
              className="col-span-2 rounded-xl border border-latte-beige bg-white px-3 py-2 text-sm"
              placeholder="Description"
              value={r.description ?? ""}
              onChange={(e) => setRewards((prev) => prev.map((x) => (x.id === r.id ? { ...x, description: e.target.value || null } : x)))}
            />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={r.active}
                onChange={(e) => setRewards((prev) => prev.map((x) => (x.id === r.id ? { ...x, active: e.target.checked } : x)))}
              />
              Active
            </label>
            <Button size="sm" onClick={() => handleSave(r)}>Save</Button>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
