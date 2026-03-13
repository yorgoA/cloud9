import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, status: 401 as const };
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return { ok: false, status: 403 as const };
  const { createClient: createAdmin } = await import("@supabase/supabase-js");
  const admin = createAdmin(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey);
  const { data: au } = await admin.from("admin_users").select("id").eq("user_id", user.id).single();
  if (!au) return { ok: false, status: 403 as const };
  return { ok: true, admin };
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const admin = auth.admin!;
  const body = await request.json();
  const customerId = body.customer_id;
  const delta = Number(body.points_delta) || 0;
  if (!customerId) return NextResponse.json({ error: "customer_id required" }, { status: 400 });
  const { data: c } = await admin.from("customers").select("points_balance").eq("id", customerId).single();
  if (!c) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  const newBalance = Math.max(0, c.points_balance + delta);
  await admin.from("customers").update({ points_balance: newBalance, updated_at: new Date().toISOString() }).eq("id", customerId);
  return NextResponse.json({ success: true, points_balance: newBalance });
}
