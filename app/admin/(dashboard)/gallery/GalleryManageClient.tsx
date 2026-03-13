"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import type { GalleryImage } from "@/lib/db/types";

export function GalleryManageClient({ initialImages }: { initialImages: GalleryImage[] }) {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/gallery", { method: "POST", body: form });
      const data = await res.json();
      if (data.path) setImages((prev) => [...prev, { id: data.id, path: data.path, caption: null, sort_order: prev.length, created_at: "" }]);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/admin/gallery", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setImages((prev) => prev.filter((i) => i.id !== id));
  };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const bucket = "gallery";

  return (
    <div className="mt-6 space-y-4">
      <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-stone-800 px-6 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-stone-700 disabled:opacity-50">
        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        {uploading ? "Uploading…" : "Upload image"}
      </label>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img) => (
          <GlassCard key={img.id} className="overflow-hidden p-0">
            <div className="relative aspect-video bg-cloud-200">
              <img
                src={`${supabaseUrl}/storage/v1/object/public/${bucket}/${img.path}`}
                alt={img.caption ?? ""}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="truncate text-sm text-stone-600">{img.path}</span>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(img.id)}>Delete</Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
