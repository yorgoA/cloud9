import { DailyCodeClient } from "./DailyCodeClient";
import { createClient } from "@/lib/supabase/server";

export default async function DailyCodePage() {
  const adminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  let currentCode: string | null = null;
  if (serviceKey) {
    const { createClient: createAdmin } = await import("@supabase/supabase-js");
    const admin = createAdmin(adminUrl, serviceKey);
    const { data } = await admin.from("daily_codes").select("code").eq("active", true).order("created_at", { ascending: false }).limit(1).single();
    currentCode = data?.code ?? null;
  }
  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-stone-800">Daily code</h1>
      <p className="mt-1 text-stone-600">Set the code customers enter to claim their visit. Change it daily.</p>
      <DailyCodeClient initialCode={currentCode} />
    </div>
  );
}
