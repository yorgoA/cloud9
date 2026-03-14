import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "./AdminShell";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const adminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  let isAdmin = false;
  if (serviceKey) {
    const { createClient: createAdmin } = await import("@supabase/supabase-js");
    const admin = createAdmin(adminUrl, serviceKey);
    const { data: au } = await admin.from("admin_users").select("id").eq("user_id", user.id).single();
    isAdmin = !!au;
  }
  if (!isAdmin) redirect("/admin/login");

  return <AdminShell>{children}</AdminShell>;
}
