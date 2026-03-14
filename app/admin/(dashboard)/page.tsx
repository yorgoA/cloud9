import Link from "next/link";
import { Utensils, Image, Gift, Users, QrCode, MessageCircle, Cloud } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { getWeekKey } from "@/lib/utils";

const links = [
  { href: "/admin/menu", label: "Menu", icon: Utensils },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/rewards", label: "Rewards", icon: Gift },
  { href: "/admin/loyalty", label: "Loyalty", icon: Users },
  { href: "/admin/in-store", label: "In-store", icon: QrCode },
  { href: "/admin/mood", label: "Cloud9 mood", icon: MessageCircle },
];

export default async function AdminDashboardPage() {
  const weekKey = getWeekKey();
  const adminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  let moodMessage: string | null = null;
  if (serviceKey) {
    const { createClient: createAdmin } = await import("@supabase/supabase-js");
    const admin = createAdmin(adminUrl, serviceKey);
    const { data } = await admin.from("cloud9_moods").select("message").eq("week_key", weekKey).single();
    moodMessage = data?.message ?? null;
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-stone-800">Dashboard</h1>
      <p className="mt-1 text-stone-600">Manage your café from here.</p>

      {moodMessage && (
        <Link href="/admin/mood" className="mt-6 block">
          <GlassCard className="flex items-start gap-3 p-4 transition-shadow hover:shadow-glass sm:p-5">
            <Cloud className="h-6 w-6 shrink-0 text-sky-blue" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-stone-600">This week&apos;s mood</p>
              <p className="mt-1 line-clamp-2 text-stone-800">{moodMessage}</p>
            </div>
          </GlassCard>
        </Link>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((item) => (
          <Link key={item.href} href={item.href}>
            <GlassCard className="flex min-h-[56px] items-center gap-4 p-4 transition-shadow hover:shadow-glass sm:p-6">
              <item.icon className="h-8 w-8 text-sky-blue" />
              <span className="font-medium text-stone-800">{item.label}</span>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
