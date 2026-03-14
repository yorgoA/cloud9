import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  if (!token) {
    return new NextResponse("Missing token", { status: 400 });
  }

  const requestUrl = new URL(request.url);
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    request.headers.get("origin") ||
    requestUrl.origin;
  const staffUrl = `${base}/staff/validate?token=${token}`;

  const svg = await QRCode.toString(staffUrl, { type: "svg", margin: 1 });
  return new NextResponse(svg, {
    headers: { "Content-Type": "image/svg+xml" },
  });
}
