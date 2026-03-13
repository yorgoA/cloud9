import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const REDEEM_TOKEN_EXPIRY_MINUTES = 5;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const rewardId = body.reward_id as string;
    if (!rewardId) {
      return NextResponse.json({ error: "Reward is required" }, { status: 400 });
    }

    const adminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const { createClient: createAdmin } = await import("@supabase/supabase-js");
    const admin = createAdmin(adminUrl, serviceKey);

    const { data: customer } = await admin
      .from("customers")
      .select("id, points_balance")
      .eq("user_id", user.id)
      .single();

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const { data: reward } = await admin
      .from("reward_catalog")
      .select("id, name, points_required")
      .eq("id", rewardId)
      .eq("active", true)
      .single();

    if (!reward || reward.points_required > customer.points_balance) {
      return NextResponse.json({ error: "Reward not available or insufficient points" }, { status: 400 });
    }

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + REDEEM_TOKEN_EXPIRY_MINUTES);
    const token = crypto.randomUUID();

    const { error: insertErr } = await admin.from("redemption_tokens").insert({
      customer_id: customer.id,
      reward_id: reward.id,
      points_required: reward.points_required,
      token,
      expires_at: expiresAt.toISOString(),
    });

    if (insertErr) {
      return NextResponse.json({ error: "Could not create redemption" }, { status: 500 });
    }

    const base = process.env.NEXT_PUBLIC_APP_URL || request.headers.get("origin") || "";
    const redeemUrl = `${base}/api/loyalty/redeem/qr?token=${token}`;

    return NextResponse.json({
      success: true,
      token,
      redeem_url: redeemUrl,
      expires_in_minutes: REDEEM_TOKEN_EXPIRY_MINUTES,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
