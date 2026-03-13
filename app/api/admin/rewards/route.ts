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
  const { data, error } = await admin.from("reward_catalog").insert({
    name: body.name ?? "New reward",
    description: body.description ?? null,
    points_required: body.points_required ?? 500,
    sort_order: body.sort_order ?? 0,
    active: body.active ?? true,
  }).select("id").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id });
}

export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const admin = auth.admin!;
  const body = await request.json();
  const { error } = await admin.from("reward_catalog").update({
    name: body.name,
    description: body.description ?? null,
    points_required: body.points_required,
    sort_order: body.sort_order ?? 0,
    active: body.active ?? true,
    updated_at: new Date().toISOString(),
  }).eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
