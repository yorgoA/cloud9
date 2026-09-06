import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { serverError } from "@/lib/api/server-error";

function toNullableString(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  return trimmed ? trimmed : null;
}

function toPositiveInt(v: unknown, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : fallback;
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const admin = auth.admin;
  const body = await request.json();
  const { data, error } = await admin
    .from("reward_catalog")
    .insert({
      name: toNullableString(body.name) ?? "New reward",
      description: toNullableString(body.description),
      points_required: toPositiveInt(body.points_required, 500),
      sort_order: Number.isFinite(Number(body.sort_order)) ? Math.round(Number(body.sort_order)) : 0,
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
    .from("reward_catalog")
    .update({
      name: toNullableString(body.name) ?? "Untitled reward",
      description: toNullableString(body.description),
      points_required: toPositiveInt(body.points_required, 500),
      sort_order: Number.isFinite(Number(body.sort_order)) ? Math.round(Number(body.sort_order)) : 0,
      active: body.active !== false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.id);
  if (error) return serverError(error);
  return NextResponse.json({ success: true });
}
