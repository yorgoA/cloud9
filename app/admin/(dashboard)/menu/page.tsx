import { MenuManageClient } from "./MenuManageClient";
import { createClient } from "@/lib/supabase/server";

export default async function AdminMenuPage() {
  const adminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const { createClient: createAdmin } = await import("@supabase/supabase-js");
  const admin = createAdmin(adminUrl, serviceKey);
  const { data: items } = await admin.from("menu_items").select("*").order("category").order("sort_order");
  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-stone-800">Menu</h1>
      <p className="mt-1 text-stone-600">Add and edit drinks and food.</p>
      <MenuManageClient initialItems={items ?? []} />
    </div>
  );
}
