import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { serverError } from "@/lib/api/server-error";

const BUCKET = "gallery";

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const admin = auth.admin;
  const form = await request.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  const name = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;
  const { data: up, error: upErr } = await admin.storage.from(BUCKET).upload(name, file, { upsert: true });
  if (upErr) return serverError(upErr);
  const { data: row, error: rowErr } = await admin
    .from("gallery_images")
    .insert({ path: up.path, sort_order: 0 })
    .select("id, path")
    .single();
  if (rowErr) return serverError(rowErr);
  return NextResponse.json({ id: row.id, path: row.path });
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const admin = auth.admin;
  const body = await request.json();
  const id = body.id;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const { data: img } = await admin.from("gallery_images").select("path").eq("id", id).single();
  if (img) await admin.storage.from(BUCKET).remove([img.path]);
  const { error } = await admin.from("gallery_images").delete().eq("id", id);
  if (error) return serverError(error);
  return NextResponse.json({ success: true });
}
