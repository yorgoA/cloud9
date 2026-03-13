import { RewardsManageClient } from "./RewardsManageClient";
import { createClient } from "@/lib/supabase/server";

export default async function AdminRewardsPage() {
  const adminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const { createClient: createAdmin } = await import("@supabase/supabase-js");
  const admin = createAdmin(adminUrl, serviceKey);
  const { data: rewards } = await admin.from("reward_catalog").select("*").order("sort_order");
  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-stone-800">Rewards</h1>
      <p className="mt-1 text-stone-600">Manage the loyalty rewards catalog.</p>
      <RewardsManageClient initialRewards={rewards ?? []} />
    </div>
  );
}
