import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { serverError } from "@/lib/api/server-error";

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const admin = auth.admin;
  const body = await request.json();
  const customerId = body.customer_id;
  const delta = Number(body.points_delta);
  if (!customerId) return NextResponse.json({ error: "customer_id required" }, { status: 400 });
  if (!Number.isFinite(delta)) return NextResponse.json({ error: "points_delta must be a number" }, { status: 400 });

  const { data: c, error: fetchErr } = await admin
    .from("customers")
    .select("points_balance")
    .eq("id", customerId)
    .single();
  if (fetchErr || !c) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

  const newBalance = Math.max(0, c.points_balance + delta);
  const { error } = await admin
    .from("customers")
    .update({ points_balance: newBalance, updated_at: new Date().toISOString() })
    .eq("id", customerId);
  if (error) return serverError(error);
  return NextResponse.json({ success: true, points_balance: newBalance });
}
