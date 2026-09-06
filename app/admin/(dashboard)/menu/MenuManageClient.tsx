"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import type { MenuItem } from "@/lib/db/types";

export function MenuManageClient({ initialItems }: { initialItems: MenuItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [saving, setSaving] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const imageUrl = (path: string) => `${supabaseUrl}/storage/v1/object/public/menu-items/${path}`;

  const handleSave = async (item: MenuItem) => {
    setSaving(item.id);
    await fetch("/api/admin/menu", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: item.id,
        name: item.name,
        name_fr: item.name_fr,
        description: item.description,
        description_fr: item.description_fr,
        price_cents: item.price_cents,
        category: item.category,
        image_path: item.image_path,
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
    if (data.id) setItems((prev) => [...prev, { ...data, name: "New item", name_fr: null, description: null, description_fr: null, price_cents: null, category: "Drinks", image_path: null, sort_order: items.length, active: true, created_at: "", updated_at: "" }]);
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/admin/menu", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleImageUpload = async (item: MenuItem, file: File) => {
    setUploadingImage(item.id);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/menu/image", { method: "POST", body: form });
      const data = await res.json();
      if (data.path) {
        const oldPath = item.image_path;
        const updated = { ...item, image_path: data.path };
        setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
        await handleSave(updated);
        if (oldPath) {
          await fetch("/api/admin/menu/image", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: oldPath }) });
        }
      }
    } finally {
      setUploadingImage(null);
    }
  };

  const handleImageRemove = async (item: MenuItem) => {
    const oldPath = item.image_path;
    const updated = { ...item, image_path: null };
    setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
    await handleSave(updated);
    if (oldPath) {
      await fetch("/api/admin/menu/image", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: oldPath }) });
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <Button onClick={handleAdd}>Add item</Button>
      {items.map((item) => (
        <GlassCard key={item.id} className="p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-latte-beige bg-white/60">
              {item.image_path ? (
                <img src={imageUrl(item.image_path)} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs text-stone-400">No photo</span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-stone-800 px-3 py-1.5 text-xs font-medium text-cream transition-colors hover:bg-stone-700 disabled:opacity-50">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingImage === item.id}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(item, file);
                    e.target.value = "";
                  }}
                />
                {uploadingImage === item.id ? "Uploading…" : item.image_path ? "Replace photo" : "Upload photo"}
              </label>
              {item.image_path && (
                <Button size="sm" variant="ghost" onClick={() => handleImageRemove(item)}>
                  Remove photo
                </Button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              className="rounded-xl border border-latte-beige bg-white px-3 py-2 text-sm"
              placeholder="Name (EN)"
              value={item.name}
              onChange={(e) => setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, name: e.target.value } : i)))}
            />
            <input
              className="rounded-xl border border-latte-beige bg-white px-3 py-2 text-sm"
              placeholder="Nom (FR)"
              value={item.name_fr ?? ""}
              onChange={(e) => setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, name_fr: e.target.value || null } : i)))}
            />
            <input
              className="rounded-xl border border-latte-beige bg-white px-3 py-2.5 text-base"
              placeholder="Description (EN)"
              value={item.description ?? ""}
              onChange={(e) => setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, description: e.target.value || null } : i)))}
            />
            <input
              className="rounded-xl border border-latte-beige bg-white px-3 py-2.5 text-base"
              placeholder="Description (FR)"
              value={item.description_fr ?? ""}
              onChange={(e) => setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, description_fr: e.target.value || null } : i)))}
            />
            <input
              className="rounded-xl border border-latte-beige bg-white px-3 py-2 text-sm"
              placeholder="Category"
              value={item.category ?? ""}
              onChange={(e) => setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, category: e.target.value || null } : i)))}
            />
            <input
              type="number"
              className="rounded-xl border border-latte-beige bg-white px-3 py-2 text-sm"
              placeholder="Price (cents)"
              value={item.price_cents ?? ""}
              onChange={(e) => setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, price_cents: e.target.value ? parseInt(e.target.value, 10) : null } : i)))}
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
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
