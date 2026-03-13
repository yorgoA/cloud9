"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import type { MenuItem } from "@/lib/db/types";

export function MenuManageClient({ initialItems }: { initialItems: MenuItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [saving, setSaving] = useState<string | null>(null);

  const handleSave = async (item: MenuItem) => {
    setSaving(item.id);
    await fetch("/api/admin/menu", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: item.id,
        name: item.name,
        description: item.description,
        price_cents: item.price_cents,
        category: item.category,
        sort_order: item.sort_order,
        active: item.active,
      }),
    });
    setSaving(null);
  };

  const handleAdd = async () => {
    const res = await fetch("/api/admin/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "New item", category: "Drinks", sort_order: items.length }),
    });
    const data = await res.json();
    if (data.id) setItems((prev) => [...prev, { ...data, name: "New item", description: null, price_cents: null, category: "Drinks", sort_order: items.length, active: true, created_at: "", updated_at: "" }]);
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/admin/menu", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="mt-6 space-y-4">
      <Button onClick={handleAdd}>Add item</Button>
      {items.map((item) => (
        <GlassCard key={item.id} className="p-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              className="rounded-xl border border-latte-beige bg-white px-3 py-2 text-sm"
              value={item.name}
              onChange={(e) => setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, name: e.target.value } : i)))}
            />
            <input
              className="rounded-xl border border-latte-beige bg-white px-3 py-2 text-sm"
              placeholder="Category"
              value={item.category ?? ""}
              onChange={(e) => setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, category: e.target.value || null } : i)))}
            />
            <input
              className="rounded-xl border border-latte-beige bg-white px-3 py-2 text-sm"
              placeholder="Description"
              value={item.description ?? ""}
              onChange={(e) => setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, description: e.target.value || null } : i)))}
            />
            <input
              type="number"
              className="rounded-xl border border-latte-beige bg-white px-3 py-2 text-sm"
              placeholder="Price (cents)"
              value={item.price_cents ?? ""}
              onChange={(e) => setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, price_cents: e.target.value ? parseInt(e.target.value, 10) : null } : i)))}
            />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={item.active}
                onChange={(e) => setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, active: e.target.checked } : i)))}
              />
              Active
            </label>
            <Button size="sm" onClick={() => handleSave(item)} disabled={saving === item.id}>Save</Button>
            <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)}>Delete</Button>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
