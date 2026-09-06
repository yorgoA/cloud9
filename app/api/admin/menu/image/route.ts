import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { serverError } from "@/lib/api/server-error";

const BUCKET = "menu-items";

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const admin = auth.admin;
  const form = await request.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  const name = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;
  const { data, error } = await admin.storage.from(BUCKET).upload(name, file, { upsert: true });
  if (error) return serverError(error);
  return NextResponse.json({ path: data.path });
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const admin = auth.admin;
  const body = await request.json();
  const path = body.path;
  if (!path) return NextResponse.json({ error: "path required" }, { status: 400 });
  const { error } = await admin.storage.from(BUCKET).remove([path]);
  if (error) return serverError(error);
  return NextResponse.json({ success: true });
}
