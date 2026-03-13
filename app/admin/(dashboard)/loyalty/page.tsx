import { LoyaltyManageClient } from "./LoyaltyManageClient";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLoyaltyPage() {
  const adminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const { createClient: createAdmin } = await import("@supabase/supabase-js");
  const admin = createAdmin(adminUrl, serviceKey);
  const { data: customers } = await admin.from("customers").select("id, name, email, points_balance, created_at").order("created_at", { ascending: false }).limit(200);
  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-stone-800">Loyalty</h1>
      <p className="mt-1 text-stone-600">View customers and adjust points.</p>
      <LoyaltyManageClient initialCustomers={customers ?? []} />
    </div>
  );
}
