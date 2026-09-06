import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

type RequireAdminResult =
  | { ok: true; admin: SupabaseClient; userId: string }
  | { ok: false; status: 401 | 403 };

/**
 * Verifies the current request is from a logged-in admin_users member.
 * Every admin API route must call this first, before touching any data.
 */
export async function requireAdmin(): Promise<RequireAdminResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, status: 401 };

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return { ok: false, status: 403 };

  const { createClient: createAdmin } = await import("@supabase/supabase-js");
  const admin = createAdmin(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey);
  const { data: au } = await admin
    .from("admin_users")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!au) return { ok: false, status: 403 };

  return { ok: true, admin, userId: user.id };
}
