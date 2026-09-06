import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { serverError } from "@/lib/api/server-error";

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const admin = auth.admin;
  const body = await request.json();
  const weekKey = body.week_key as string;
  const message = (body.message as string) ?? "";
  if (!weekKey) return NextResponse.json({ error: "week_key required" }, { status: 400 });
  const { error } = await admin.from("cloud9_moods").upsert(
    { week_key: weekKey, message, updated_at: new Date().toISOString() },
    { onConflict: "week_key" }
  );
  if (error) return serverError(error);
  return NextResponse.json({ success: true });
}
