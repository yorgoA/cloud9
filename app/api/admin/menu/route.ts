import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { serverError } from "@/lib/api/server-error";

function toNullableString(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  return trimmed ? trimmed : null;
}

function toNullableInt(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n) : null;
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const admin = auth.admin;
  const body = await request.json();
  const { data, error } = await admin
    .from("menu_items")
    .insert({
      name: toNullableString(body.name) ?? "New item",
      name_fr: toNullableString(body.name_fr),
      description: toNullableString(body.description),
      description_fr: toNullableString(body.description_fr),
      price_cents: toNullableInt(body.price_cents),
      category: toNullableString(body.category),
      image_path: toNullableString(body.image_path),
      sort_order: toNullableInt(body.sort_order) ?? 0,
      active: body.active !== false,
    })
    .select("id")
    .single();
  if (error) return serverError(error);
  return NextResponse.json({ id: data.id });
}

export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const admin = auth.admin;
  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const { error } = await admin
    .from("menu_items")
    .update({
      name: toNullableString(body.name) ?? "Untitled item",
      name_fr: toNullableString(body.name_fr),
      description: toNullableString(body.description),
      description_fr: toNullableString(body.description_fr),
      price_cents: toNullableInt(body.price_cents),
      category: toNullableString(body.category),
      image_path: toNullableString(body.image_path),
      sort_order: toNullableInt(body.sort_order) ?? 0,
      active: body.active !== false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.id);
  if (error) return serverError(error);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const admin = auth.admin;
  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const { error } = await admin.from("menu_items").delete().eq("id", body.id);
  if (error) return serverError(error);
  return NextResponse.json({ success: true });
}
