"use client";

import { CloudShape } from "./CloudShape";

export function CloudBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-sky-blue/20 via-powder-blue/15 to-cream/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(168,212,230,0.35),transparent_60%)]" />
      <CloudShape size="lg" className="top-[8%] left-[5%]" delay={0} opacity={0.85} />
      <CloudShape size="md" className="top-[25%] right-[8%]" delay={1} opacity={0.8} />
      <CloudShape size="sm" className="top-[55%] left-[10%]" delay={2} opacity={0.75} />
      <CloudShape size="md" className="bottom-[15%] right-[15%]" delay={0.5} opacity={0.8} />
      <CloudShape size="sm" className="bottom-[25%] left-[35%]" delay={1.5} opacity={0.7} />
      <CloudShape size="sm" className="top-[40%] right-[30%]" delay={2.5} opacity={0.65} />
      <CloudShape size="md" className="bottom-[40%] left-[60%]" delay={1} opacity={0.7} />
      <CloudShape size="sm" className="top-[70%] right-[45%]" delay={0.8} opacity={0.6} />
      <CloudShape size="md" className="top-[35%] left-[2%]" delay={1.8} opacity={0.7} />
      <CloudShape size="sm" className="top-[15%] right-[35%]" delay={0.3} opacity={0.65} />
      <CloudShape size="md" className="bottom-[55%] right-[5%]" delay={2.2} opacity={0.7} />
      <CloudShape size="sm" className="top-[65%] left-[45%]" delay={1.2} opacity={0.6} />
    </div>
  );
}
