import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  if (!token) {
    return new NextResponse("Missing token", { status: 400 });
  }

  const supabase = await createClient();
  const adminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return new NextResponse("Server error", { status: 500 });
  }

  const { createClient: createAdmin } = await import("@supabase/supabase-js");
  const admin = createAdmin(adminUrl, serviceKey);

  const base = process.env.NEXT_PUBLIC_APP_URL || request.headers.get("origin") || "";
  const staffUrl = `${base}/staff/validate?token=${token}`;

  const svg = await QRCode.toString(staffUrl, { type: "svg", margin: 1 });
  return new NextResponse(svg, {
    headers: { "Content-Type": "image/svg+xml" },
  });
}
