"use client";

import dynamic from "next/dynamic";

const SpinningCup = dynamic(
  () => import("./SpinningCup").then((mod) => mod.SpinningCup),
  { ssr: false }
);

export { SpinningCup };
