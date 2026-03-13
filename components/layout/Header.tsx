"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Cloud, LogOut, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/concept", label: "Concept" },
  { href: "/menu", label: "Menu" },
  { href: "/gallery", label: "Gallery" },
  { href: "/loyalty", label: "Loyalty" },
  { href: "/visit", label: "Visit Us" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/loyalty");
    router.refresh();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/40 bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 font-serif text-xl font-medium text-[#5D4037]"
          >
            <Cloud className="h-7 w-7 text-sky-blue" />
            Cloud9
          </Link>

          <nav className="hidden md:flex md:items-center md:gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-powder-blue/30 text-stone-800"
                  : "text-stone-600 hover:bg-cloud-200/80 hover:text-stone-800"
              )}
            >
              {link.label}
            </Link>
          ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {user ? (
            <>
              <Button asChild size="sm" variant="coffee">
                <Link href="/loyalty/app">My Rewards</Link>
              </Button>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-cloud-200/80 hover:text-stone-800"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </>
          ) : (
            <Button asChild size="sm" variant="coffee">
              {pathname === "/loyalty/claim/login" ? (
                <a href="/loyalty/claim/login">Log in</a>
              ) : (
                <Link href="/loyalty/claim/login">Log in</Link>
              )}
            </Button>
          )}
          <button
            type="button"
            className="md:hidden rounded-xl p-2 text-stone-600 hover:bg-cloud-200"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-white/40 bg-cream/95 backdrop-blur-md"
        >
          <nav className="flex flex-col gap-1 p-4">
            {user ? (
              <>
                <Link
                  href="/loyalty/app"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-cloud-200/80"
                >
                  My Rewards
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    handleSignOut();
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-medium hover:bg-cloud-200/80"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </>
            ) : (
              <Button asChild size="sm" variant="coffee" className="w-full justify-center">
                {pathname === "/loyalty/claim/login" ? (
                  <a href="/loyalty/claim/login" onClick={() => setOpen(false)}>
                    Log in
                  </a>
                ) : (
                  <Link href="/loyalty/claim/login" onClick={() => setOpen(false)}>
                    Log in
                  </Link>
                )}
              </Button>
            )}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm font-medium",
                  pathname === link.href ? "bg-powder-blue/30" : "hover:bg-cloud-200/80"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  );
}
