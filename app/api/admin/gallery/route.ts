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

const BUCKET = "gallery";

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const admin = auth.admin!;
  const form = await request.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  const name = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;
  const { data: up, error: upErr } = await admin.storage.from(BUCKET).upload(name, file, { upsert: true });
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });
  const { data: row, error: rowErr } = await admin.from("gallery_images").insert({ path: up.path, sort_order: 0 }).select("id, path").single();
  if (rowErr) return NextResponse.json({ error: rowErr.message }, { status: 500 });
  return NextResponse.json({ id: row.id, path: row.path });
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const admin = auth.admin!;
  const body = await request.json();
  const id = body.id;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const { data: img } = await admin.from("gallery_images").select("path").eq("id", id).single();
  if (img) await admin.storage.from(BUCKET).remove([img.path]);
  await admin.from("gallery_images").delete().eq("id", id);
  return NextResponse.json({ success: true });
}
