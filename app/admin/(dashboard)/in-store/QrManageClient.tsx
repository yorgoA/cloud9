"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";

export function QrManageClient() {
  const handlePrint = () => window.print();

  const base = typeof window !== "undefined" ? window.location.origin : "";
  const claimUrl = `${base}/loyalty/claim`;
  const qrImageUrl = `${base}/api/qr?url=${encodeURIComponent(claimUrl)}`;

  return (
    <div className="space-y-6 print:space-y-0">
      <GlassCard className="p-6 print:border-0 print:bg-transparent print:shadow-none print:p-0 print:[filter:none]">
        <div className="flex flex-wrap gap-3 print:hidden">
          <Button variant="secondary" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print QR
          </Button>
        </div>
        <div className="mt-6 print:mt-0 print:flex print:flex-col print:items-center print:justify-center print:[page-break-inside:avoid]">
          <p className="text-sm text-stone-600 print:hidden">
            Claim page (customers scan and enter the daily code):
          </p>
          <p className="mt-1 break-all font-mono text-sm text-stone-800 print:hidden">{claimUrl}</p>
          <div className="mt-4 flex flex-col items-center justify-center rounded-2xl bg-white p-4 print:mt-0 print:rounded-none print:bg-white print:p-6 print:break-inside-avoid">
            <img
              src={qrImageUrl}
              alt="Cloud9 - Scan to claim your visit"
              className="h-48 w-48 object-contain print:h-64 print:w-64"
            />
            <p className="mt-4 font-serif text-lg font-semibold text-stone-800 print:mt-4 print:text-xl">
              CLOUD9 — Scan to claim your visit
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
