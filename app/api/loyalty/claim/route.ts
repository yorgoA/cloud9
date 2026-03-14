import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const POINTS_PER_VISIT = 100;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const code = (body.code as string)?.trim()?.toUpperCase();
    if (!code) {
      return NextResponse.json({ error: "Daily code is required" }, { status: 400 });
    }

    // Use service role to read daily_codes and write claims
    const adminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const { createClient: createAdmin } = await import("@supabase/supabase-js");
    const admin = createAdmin(adminUrl, serviceKey);

    // Get active daily code
    const { data: activeCodeRow } = await admin
      .from("daily_codes")
      .select("code")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!activeCodeRow || activeCodeRow.code !== code) {
      return NextResponse.json({ error: "Invalid daily code" }, { status: 400 });
    }

    // Get or create customer
    const { data: customer, error: customerError } = await admin
      .from("customers")
      .select("id, points_balance")
      .eq("user_id", user.id)
      .single();

    if (customerError || !customer) {
      const { data: newCustomer, error: insertErr } = await admin
        .from("customers")
        .insert({ user_id: user.id, email: user.email })
        .select("id, points_balance")
        .single();
      if (insertErr || !newCustomer) {
        return NextResponse.json({ error: "Could not find or create customer" }, { status: 500 });
      }
      return await addClaim(admin, newCustomer.id, newCustomer.points_balance);
    }

    return await addClaim(admin, customer.id, customer.points_balance);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

const CAFE_TIMEZONE = "Europe/Paris";

function getDateInTimezone(tz: string): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: tz });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function addClaim(admin: any, customerId: string, currentBalance: number) {
  const today = getDateInTimezone(CAFE_TIMEZONE);

  const { data: existing } = await admin
    .from("loyalty_claims")
    .select("id")
    .eq("customer_id", customerId)
    .eq("claim_date", today)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "You have already claimed today. See you tomorrow!" }, { status: 400 });
  }

  const { error: insertErr } = await admin.from("loyalty_claims").insert({
    customer_id: customerId,
    claim_date: today,
    points_awarded: POINTS_PER_VISIT,
  });

  if (insertErr) {
    return NextResponse.json({ error: "Could not record claim" }, { status: 500 });
  }

  await admin
    .from("customers")
    .update({
      points_balance: currentBalance + POINTS_PER_VISIT,
      updated_at: new Date().toISOString(),
    })
    .eq("id", customerId);

  return NextResponse.json({ success: true, points_added: POINTS_PER_VISIT });
}
