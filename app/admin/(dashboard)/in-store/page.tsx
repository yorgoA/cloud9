import { DailyCodeClient } from "./DailyCodeClient";
import { QrManageClient } from "./QrManageClient";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function InStorePage() {
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
      <div className="print:hidden">
        <h1 className="font-serif text-2xl font-medium text-stone-800">In-store</h1>
        <p className="mt-1 text-stone-600">
          Set the daily code and print the QR. Customers scan the QR, enter the code, and claim their visit.
        </p>
      </div>
      <div className="mt-6 flex flex-col gap-8 print:flex-col">
        <DailyCodeClient initialCode={currentCode} />
        <QrManageClient />
      </div>
    </div>
  );
}
