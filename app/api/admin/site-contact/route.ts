import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getSiteContact, SITE_CONTACT_ID, type SiteContact } from "@/lib/site-contact";
import { requireAdmin } from "@/lib/auth/require-admin";
import { serverError } from "@/lib/api/server-error";

export async function GET() {
  try {
    const supabase = await createClient();
    const contact = await getSiteContact(supabase);
    return NextResponse.json(contact);
  } catch (e) {
    return serverError(e);
  }
}

function toTrimmedString(v: unknown, fallback: string): string {
  return typeof v === "string" && v.trim() ? v.trim() : fallback;
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  const admin = auth.admin;

  try {
    const body = (await request.json()) as Partial<SiteContact>;
    const { DEFAULTS } = await import("@/lib/site-contact");
    const row = {
      id: SITE_CONTACT_ID,
      address_line1: toTrimmedString(body.address_line1, DEFAULTS.address_line1),
      address_line2: toTrimmedString(body.address_line2, DEFAULTS.address_line2),
      address_line3: toTrimmedString(body.address_line3, DEFAULTS.address_line3),
      phone: toTrimmedString(body.phone, DEFAULTS.phone),
      email: toTrimmedString(body.email, DEFAULTS.email),
      instagram: toTrimmedString(body.instagram, DEFAULTS.instagram),
      tiktok: toTrimmedString(body.tiktok, DEFAULTS.tiktok),
      updated_at: new Date().toISOString(),
    };

    const { error } = await admin.from("site_contact").upsert(row, { onConflict: "id" });

    if (error) {
      const isTableMissing = error.code === "42P01" || error.code === "PGRST205";
      if (isTableMissing) {
        console.error("site_contact save error:", error);
        return NextResponse.json(
          { error: "Run supabase/RUN_THIS_FOR_ADDRESSES.sql in your Supabase SQL Editor first" },
          { status: 500 }
        );
      }
      return serverError(error);
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return serverError(e);
  }
}
