"use client";

import { motion } from "framer-motion";
import { LogOut, Menu } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "./LocaleSwitcher";

const navLinkKeys = [
  { href: "/", key: "home" },
  { href: "/concept", key: "concept" },
  { href: "/menu", key: "menu" },
  { href: "/gallery", key: "gallery" },
  { href: "/loyalty", key: "loyalty" },
  { href: "/visit", key: "visitUs" },
] as const;

export function Header() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/loyalty");
    router.refresh();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b-2 border-espresso bg-cream">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex shrink-0 items-center" aria-label={t("cloud9")}>
            <Image
              src="/brand/logo-blue.png"
              alt={t("cloud9")}
              width={160}
              height={109}
              priority
              className="h-12 w-auto"
            />
          </Link>

          <nav className="hidden md:flex md:items-center md:gap-1.5">
            {navLinkKeys.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-all",
                  pathname === link.href
                    ? "border-2 border-espresso bg-dusty-blue text-cream shadow-hard-sm"
                    : "border-2 border-transparent text-espresso hover:border-espresso hover:bg-powder-blue/40"
                )}
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <LocaleSwitcher />
          {user ? (
            <>
              <Button asChild size="sm" variant="coffee">
                <Link href="/loyalty/app">{t("myRewards")}</Link>
              </Button>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-coffee-hover/80 hover:text-stone-800"
              >
                <LogOut className="h-4 w-4" />
                {t("signOut")}
              </button>
            </>
          ) : (
            <Button asChild size="sm" variant="coffee">
              <Link href="/loyalty/claim/login">{t("logIn")}</Link>
            </Button>
          )}
          <button
            type="button"
            className="md:hidden rounded-xl p-2 text-stone-600 hover:bg-coffee-hover"
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
          className="md:hidden border-t-2 border-espresso bg-cream"
        >
          <nav className="flex flex-col gap-1 p-4">
            {user ? (
              <>
                <Link
                  href="/loyalty/app"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-coffee-hover/80"
                >
                  {t("myRewards")}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    handleSignOut();
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-medium hover:bg-coffee-hover/80"
                >
                  <LogOut className="h-4 w-4" />
                  {t("signOut")}
                </button>
              </>
            ) : (
              <Button
                asChild
                size="sm"
                variant="coffee"
                className="w-full justify-center"
              >
                <Link href="/loyalty/claim/login" onClick={() => setOpen(false)}>
                  {t("logIn")}
                </Link>
              </Button>
            )}
            <LocaleSwitcher />
            {navLinkKeys.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm font-medium",
                  pathname === link.href
                    ? "bg-coffee-hover"
                    : "hover:bg-coffee-hover/80"
                )}
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  );
}
