"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import type { SiteContact } from "@/lib/site-contact";
import { MapPin, Phone, Mail, Instagram } from "lucide-react";

interface AddressSuggestion {
  label: string;
  name: string;
  postcode: string;
  city: string;
  district: string | null;
}

export function AddressesClient({ initialContact }: { initialContact: SiteContact }) {
  const [contact, setContact] = useState(initialContact);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<"success" | "error" | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const skipNextSearch = useRef(false);

  useEffect(() => {
    setContact(initialContact);
  }, [initialContact]);

  // Free French government address autocomplete (api-adresse.data.gouv.fr) — no API key needed.
  useEffect(() => {
    if (skipNextSearch.current) {
      skipNextSearch.current = false;
      return;
    }
    const query = contact.address_line1.trim();
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`
        );
        const data = await res.json();
        setSuggestions(
          (data.features ?? []).map(
            (f: {
              properties: {
                label: string;
                name: string;
                postcode: string;
                city: string;
                district?: string;
              };
            }) => ({
              label: f.properties.label,
              name: f.properties.name,
              postcode: f.properties.postcode,
              city: f.properties.city,
              district: f.properties.district ?? null,
            })
          )
        );
      } catch {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [contact.address_line1]);

  const selectSuggestion = (s: AddressSuggestion) => {
    skipNextSearch.current = true;
    setContact((c) => ({
      ...c,
      address_line1: s.name,
      address_line2: s.district ?? s.postcode,
      address_line3: s.city,
    }));
    setSuggestions([]);
    setShowSuggestions(false);
  };

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

  const otherFields = [
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
        <div className="relative">
          <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
            <MapPin className="h-4 w-4" />
            Address line 1
          </label>
          <input
            type="text"
            value={contact.address_line1}
            onChange={(e) => setContact((c) => ({ ...c, address_line1: e.target.value }))}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder="Start typing an address…"
            autoComplete="off"
            className="mt-1.5 w-full rounded-2xl border border-latte-beige bg-soft-white/80 px-4 py-3 text-stone-800 placeholder:text-stone-400 focus:border-sky-blue focus:outline-none focus:ring-2 focus:ring-sky-blue/20"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-2xl border border-latte-beige bg-white shadow-lg">
              {suggestions.map((s) => (
                <li key={s.label}>
                  <button
                    type="button"
                    onMouseDown={() => selectSuggestion(s)}
                    className="block w-full px-4 py-2.5 text-left text-sm text-stone-700 hover:bg-coffee-hover"
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-1 text-xs text-stone-400">
            Start typing a French address to see suggestions (postcode and city fill in automatically).
          </p>
        </div>

        {otherFields.map(({ key, label, icon: Icon }) => (
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
