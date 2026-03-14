"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Cloud,
  LayoutDashboard,
  Utensils,
  Image,
  Gift,
  Users,
  QrCode,
  MessageCircle,
  ExternalLink,
  MapPin,
  Menu,
  X,
} from "lucide-react";

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

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cloud-100">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar - slide-in drawer on mobile, fixed on desktop */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-full w-64 max-w-[85vw] border-r border-latte-beige/60 bg-cream shadow-xl transition-transform duration-200 ease-out print:hidden
          md:z-40 md:w-56 md:max-w-none md:translate-x-0 md:shadow-none
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex h-14 items-center justify-between border-b border-latte-beige/60 px-4 md:h-16">
          <div className="flex items-center gap-2">
            <Cloud className="h-6 w-6 text-sky-blue md:h-7 md:w-7" />
            <span className="font-serif text-base font-medium text-stone-800 md:text-lg">Cloud9 Admin</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-stone-600 hover:bg-coffee-hover hover:text-stone-800 md:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-[44px] items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-coffee-hover hover:text-stone-800 active:bg-coffee-hover"
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="md:pl-56 print:pl-0">
        <header className="sticky top-0 z-30 flex h-14 min-h-[44px] items-center justify-between gap-4 border-b border-latte-beige/60 bg-cream px-4 print:hidden sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-stone-600 hover:bg-coffee-hover hover:text-stone-800 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link
            href="/"
            className="flex min-h-[44px] items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-coffee-hover hover:text-stone-800"
          >
            <ExternalLink className="h-4 w-4" />
            View site
          </Link>
        </header>
        <div className="min-h-screen p-4 print:p-0 print:min-h-0 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
