import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Sliding-window rate limiter for API routes: 60 requests / 60s per IP.
 * Returns null if Upstash env vars aren't configured — callers must treat
 * that as "skip the check" (fail open) rather than crash, so the app keeps
 * working locally and before Redis is provisioned.
 */
export const ratelimit: Ratelimit | null =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL,
          token: process.env.UPSTASH_REDIS_REST_TOKEN,
        }),
        limiter: Ratelimit.slidingWindow(60, "60 s"),
        analytics: true,
        prefix: "cloud9-ratelimit",
      })
    : null;
