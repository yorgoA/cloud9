"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { createClient } from "@/lib/supabase/client";

export function AdminLoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: e } = await supabase.auth.signInWithPassword({ email, password });
      if (e) {
        setError(e.message);
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="flex items-center justify-center gap-2">
        <Cloud className="h-10 w-10 text-sky-blue" />
        <span className="font-serif text-2xl font-medium text-stone-800">Cloud9 Admin</span>
      </div>
      <GlassCard className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-stone-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-2xl border border-latte-beige bg-soft-white/80 px-4 py-3 focus:border-sky-blue focus:outline-none focus:ring-2 focus:ring-sky-blue/20"
          />
          <label className="block text-sm font-medium text-stone-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-2xl border border-latte-beige bg-soft-white/80 px-4 py-3 focus:border-sky-blue focus:outline-none focus:ring-2 focus:ring-sky-blue/20"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </GlassCard>
    </div>
  );
}
