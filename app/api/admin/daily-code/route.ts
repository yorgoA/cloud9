import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const adminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { createClient: createAdmin } = await import("@supabase/supabase-js");
  const admin = createAdmin(adminUrl, serviceKey);
  const { data: au } = await admin.from("admin_users").select("id").eq("user_id", user.id).single();
  if (!au) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const code = (body.code as string)?.trim()?.toUpperCase();
  if (!code) return NextResponse.json({ error: "Code required" }, { status: 400 });

  await admin.from("daily_codes").update({ active: false }).eq("active", true);
  await admin.from("daily_codes").insert({ code, active: true });
  return NextResponse.json({ success: true });
}
