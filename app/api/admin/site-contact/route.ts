import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getSiteContact, SITE_CONTACT_ID, type SiteContact } from "@/lib/site-contact";

export async function GET() {
  try {
    const supabase = await createClient();
    const contact = await getSiteContact(supabase);
    return NextResponse.json(contact);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

    const adminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const { createClient: createAdmin } = await import("@supabase/supabase-js");
    const admin = createAdmin(adminUrl, serviceKey);

    const { data: au } = await admin.from("admin_users").select("id").eq("user_id", user.id).single();
    if (!au) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await request.json()) as Partial<SiteContact>;
    const { DEFAULTS } = await import("@/lib/site-contact");
    const row = {
      id: SITE_CONTACT_ID,
      address_line1: body.address_line1 ?? DEFAULTS.address_line1,
      address_line2: body.address_line2 ?? DEFAULTS.address_line2,
      address_line3: body.address_line3 ?? DEFAULTS.address_line3,
      phone: body.phone ?? DEFAULTS.phone,
      email: body.email ?? DEFAULTS.email,
      instagram: body.instagram ?? DEFAULTS.instagram,
      tiktok: body.tiktok ?? DEFAULTS.tiktok,
      updated_at: new Date().toISOString(),
    };

    const { error } = await admin
      .from("site_contact")
      .upsert(row, { onConflict: "id" });

    if (error) {
      console.error("site_contact save error:", error);
      const isTableMissing = error.code === "42P01" || error.code === "PGRST205";
      return NextResponse.json(
        {
          error: isTableMissing
            ? "Run supabase/RUN_THIS_FOR_ADDRESSES.sql in your Supabase SQL Editor first"
            : "Failed to save",
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
