import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const adminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  const { createClient: createAdmin } = await import("@supabase/supabase-js");
  const admin = createAdmin(adminUrl, serviceKey);

  const { data: rt, error: rtErr } = await admin
    .from("redemption_tokens")
    .select("id, customer_id, reward_id, points_required, expires_at, used_at")
    .eq("token", token)
    .single();

  if (rtErr || !rt) {
    return NextResponse.json({ error: "Token not found" }, { status: 404 });
  }
  if (rt.used_at) {
    return NextResponse.json({ error: "This redemption has already been used" }, { status: 400 });
  }
  if (new Date(rt.expires_at) < new Date()) {
    return NextResponse.json({ error: "This redemption has expired" }, { status: 400 });
  }

  const { data: customer } = await admin.from("customers").select("name, email, points_balance").eq("id", rt.customer_id).single();
  const { data: reward } = await admin.from("reward_catalog").select("name").eq("id", rt.reward_id).single();

  return NextResponse.json({
    customer_name: customer?.name || customer?.email || "Customer",
    reward_name: reward?.name ?? "Reward",
    points_required: rt.points_required,
    current_balance: customer?.points_balance ?? 0,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = body.token as string;
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const adminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

    const { createClient: createAdmin } = await import("@supabase/supabase-js");
    const admin = createAdmin(adminUrl, serviceKey);

    const { data: rt, error: rtErr } = await admin
      .from("redemption_tokens")
      .select("id, customer_id, reward_id, points_required, used_at, expires_at")
      .eq("token", token)
      .single();

    if (rtErr || !rt) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }
    if (rt.used_at) {
      return NextResponse.json({ error: "Already used" }, { status: 400 });
    }
    if (new Date(rt.expires_at) < new Date()) {
      return NextResponse.json({ error: "Expired" }, { status: 400 });
    }

    const { data: customer } = await admin.from("customers").select("points_balance").eq("id", rt.customer_id).single();
    if (!customer || customer.points_balance < rt.points_required) {
      return NextResponse.json({ error: "Insufficient points" }, { status: 400 });
    }

    const now = new Date().toISOString();
    await admin.from("redemption_tokens").update({ used_at: now }).eq("id", rt.id);
    await admin.from("customers").update({
      points_balance: customer.points_balance - rt.points_required,
      updated_at: now,
    }).eq("id", rt.customer_id);
    await admin.from("reward_redemptions").insert({
      customer_id: rt.customer_id,
      reward_id: rt.reward_id,
      points_used: rt.points_required,
      status: "validated",
      validated_at: now,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
