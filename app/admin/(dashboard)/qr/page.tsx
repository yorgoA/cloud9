import { QrManageClient } from "./QrManageClient";
import { createClient } from "@/lib/supabase/server";
import { getWeekKey } from "@/lib/utils";

export default async function AdminQrPage() {
  const weekKey = getWeekKey();
  const adminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  let currentToken: string | null = null;
  if (serviceKey) {
    const { createClient: createAdmin } = await import("@supabase/supabase-js");
    const admin = createAdmin(adminUrl, serviceKey);
    const { data } = await admin.from("weekly_qr").select("token").eq("week_key", weekKey).single();
    currentToken = data?.token ?? null;
  }
  return (
    <div>
      <div className="print:hidden">
        <h1 className="font-serif text-2xl font-medium text-stone-800">Weekly QR</h1>
        <p className="mt-1 text-stone-600">Generate the in-store QR that links to the loyalty claim page for this week.</p>
      </div>
      <QrManageClient weekKey={weekKey} currentToken={currentToken} />
    </div>
  );
}
