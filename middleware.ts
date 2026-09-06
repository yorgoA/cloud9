import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";
import { ratelimit } from "@/lib/rate-limit";

const intlMiddleware = createIntlMiddleware(routing);

async function checkRateLimit(request: NextRequest) {
  if (!ratelimit) return null; // Redis not configured — skip rather than block requests.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);
  if (success) return null;
  return NextResponse.json(
    { error: "Too many requests. Please slow down." },
    {
      status: 429,
      headers: {
        "Retry-After": Math.max(0, Math.ceil((reset - Date.now()) / 1000)).toString(),
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
      },
    }
  );
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/api")) {
    const limited = await checkRateLimit(request);
    if (limited) return limited;
    return await updateSession(request);
  }

  const isNonLocale = pathname.startsWith("/admin") || pathname.startsWith("/staff") || pathname.startsWith("/auth");

  if (isNonLocale) {
    return await updateSession(request);
  }

  const intlResponse = intlMiddleware(request);
  return await updateSession(request, intlResponse);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
