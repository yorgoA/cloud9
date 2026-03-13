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
  const weekKey = body.week_key as string;
  const message = (body.message as string) ?? "";
  if (!weekKey) return NextResponse.json({ error: "week_key required" }, { status: 400 });
  await admin.from("cloud9_moods").upsert(
    { week_key: weekKey, message, updated_at: new Date().toISOString() },
    { onConflict: "week_key" }
  );
  return NextResponse.json({ success: true });
}
