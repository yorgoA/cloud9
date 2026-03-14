"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import type { SiteContact } from "@/lib/site-contact";
import { MapPin, Phone, Mail, Instagram } from "lucide-react";

export function AddressesClient({ initialContact }: { initialContact: SiteContact }) {
  const [contact, setContact] = useState(initialContact);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    setContact(initialContact);
  }, [initialContact]);

  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    setErrorDetail(null);
    try {
      const res = await fetch("/api/admin/site-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });
      let errMsg = "Failed to save";
      try {
        const data = await res.json();
        if (data.error) errMsg = data.error;
      } catch {
        /* ignore */
      }
      if (!res.ok) {
        setMessage("error");
        setErrorDetail(errMsg);
        return;
      }
      setMessage("success");
    } catch {
      setMessage("error");
      setErrorDetail("Network error");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "address_line1" as const, label: "Address line 1", icon: MapPin },
    { key: "address_line2" as const, label: "Address line 2" },
    { key: "address_line3" as const, label: "City / region" },
    { key: "phone" as const, label: "Phone", icon: Phone },
    { key: "email" as const, label: "Email", icon: Mail },
    { key: "instagram" as const, label: "Instagram URL", icon: Instagram },
    { key: "tiktok" as const, label: "TikTok URL" },
  ];

  return (
    <GlassCard className="mt-6 max-w-xl p-6">
      <div className="space-y-4">
        {fields.map(({ key, label, icon: Icon }) => (
          <div key={key}>
            <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
              {Icon && <Icon className="h-4 w-4" />}
              {label}
            </label>
            <input
              type="text"
              value={contact[key]}
              onChange={(e) => setContact((c) => ({ ...c, [key]: e.target.value }))}
              placeholder={label}
              className="mt-1.5 w-full rounded-2xl border border-latte-beige bg-soft-white/80 px-4 py-3 text-stone-800 placeholder:text-stone-400 focus:border-sky-blue focus:outline-none focus:ring-2 focus:ring-sky-blue/20"
            />
          </div>
        ))}
      </div>
      {message === "success" && (
        <p className="mt-4 text-sm text-green-600">Addresses updated. Changes will appear on the site.</p>
      )}
      {message === "error" && (
        <p className="mt-4 text-sm text-red-600">
          {errorDetail || "Failed to save. Please try again."}
        </p>
      )}
      <Button className="mt-6" onClick={handleSave} disabled={loading}>
        {loading ? "Saving…" : "Save changes"}
      </Button>
    </GlassCard>
  );
}
