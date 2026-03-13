import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  if (!url) return new NextResponse("Missing url", { status: 400 });
  const svg = await QRCode.toString(url, { type: "svg", margin: 1 });
  return new NextResponse(svg, { headers: { "Content-Type": "image/svg+xml" } });
}
