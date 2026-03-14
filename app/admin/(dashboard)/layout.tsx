import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Cloud, LayoutDashboard, Utensils, Image, Gift, Users, QrCode, MessageCircle, ExternalLink, MapPin } from "lucide-react";

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

  const nav = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/menu", label: "Menu", icon: Utensils },
    { href: "/admin/gallery", label: "Gallery", icon: Image },
    { href: "/admin/rewards", label: "Rewards", icon: Gift },
    { href: "/admin/loyalty", label: "Loyalty", icon: Users },
    { href: "/admin/in-store", label: "In-store", icon: QrCode },
    { href: "/admin/mood", label: "Cloud9 mood", icon: MessageCircle },
    { href: "/admin/addresses", label: "Addresses", icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-cloud-100">
      <aside className="fixed left-0 top-0 z-40 h-full w-56 border-r border-latte-beige/60 bg-cream/95 print:hidden">
        <div className="flex h-16 items-center gap-2 border-b border-latte-beige/60 px-4">
          <Cloud className="h-7 w-7 text-sky-blue" />
          <span className="font-serif text-lg font-medium text-stone-800">Cloud9 Admin</span>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-stone-600 hover:bg-coffee-hover hover:text-stone-800"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="pl-56 print:pl-0">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-end border-b border-latte-beige/60 bg-cream/80 px-6 backdrop-blur-sm print:hidden">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-coffee-hover hover:text-stone-800"
          >
            <ExternalLink className="h-4 w-4" />
            View site
          </Link>
        </header>
        <div className="min-h-screen p-6 print:p-0 print:min-h-0">{children}</div>
      </div>
    </div>
  );
}
