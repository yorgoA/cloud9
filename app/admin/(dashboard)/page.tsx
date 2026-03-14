import Link from "next/link";
import { Utensils, Image, Gift, Users, QrCode, MessageCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const links = [
  { href: "/admin/menu", label: "Menu", icon: Utensils },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/rewards", label: "Rewards", icon: Gift },
  { href: "/admin/loyalty", label: "Loyalty", icon: Users },
  { href: "/admin/in-store", label: "In-store", icon: QrCode },
  { href: "/admin/mood", label: "Cloud9 mood", icon: MessageCircle },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-stone-800">Dashboard</h1>
      <p className="mt-1 text-stone-600">Manage your café from here.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((item) => (
          <Link key={item.href} href={item.href}>
            <GlassCard className="flex items-center gap-4 p-6 transition-shadow hover:shadow-glass">
              <item.icon className="h-8 w-8 text-sky-blue" />
              <span className="font-medium text-stone-800">{item.label}</span>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
