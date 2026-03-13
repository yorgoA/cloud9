import { GalleryManageClient } from "./GalleryManageClient";
import { createClient } from "@/lib/supabase/server";

export default async function AdminGalleryPage() {
  const adminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const { createClient: createAdmin } = await import("@supabase/supabase-js");
  const admin = createAdmin(adminUrl, serviceKey);
  const { data: images } = await admin.from("gallery_images").select("*").order("sort_order");
  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-stone-800">Gallery</h1>
      <p className="mt-1 text-stone-600">Upload and manage gallery images.</p>
      <GalleryManageClient initialImages={images ?? []} />
    </div>
  );
}
