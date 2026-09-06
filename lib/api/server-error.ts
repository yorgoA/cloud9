import { NextResponse } from "next/server";

/**
 * Logs the real error server-side (visible in Vercel logs) and returns a
 * fixed, generic message to the client. Never echo error.message directly —
 * it can leak Postgres constraint text, file paths, or internal structure.
 */
export function serverError(error: unknown, status = 500) {
  console.error(error);
  return NextResponse.json(
    { error: "Something went wrong. Please try again." },
    { status }
  );
}
