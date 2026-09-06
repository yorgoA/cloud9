import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { serverError } from "@/lib/api/server-error";

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const admin = auth.admin;

  const body = await request.json();
  const code = (body.code as string)?.trim()?.toUpperCase();
  if (!code) return NextResponse.json({ error: "Code required" }, { status: 400 });

  const { error: deactivateErr } = await admin.from("daily_codes").update({ active: false }).eq("active", true);
  if (deactivateErr) return serverError(deactivateErr);
  const { error: insertErr } = await admin.from("daily_codes").insert({ code, active: true });
  if (insertErr) return serverError(insertErr);
  return NextResponse.json({ success: true });
}
