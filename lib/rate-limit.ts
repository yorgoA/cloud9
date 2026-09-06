import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Sliding-window rate limiter for API routes: 60 requests / 60s per IP.
 * Returns null if Upstash env vars aren't configured — callers must treat
 * that as "skip the check" (fail open) rather than crash, so the app keeps
 * working locally and before Redis is provisioned.
 *
 * Reads the plain Upstash names first (used locally / on a direct Upstash
 * connection), falling back to the `UPSTASH_REDIS_REST_KV_REST_API_*` names
 * Vercel's Upstash marketplace integration generates when the database is
 * connected with a custom "UPSTASH_REDIS_REST" env var prefix.
 */
const url =
  process.env.UPSTASH_REDIS_REST_URL ?? process.env.UPSTASH_REDIS_REST_KV_REST_API_URL;
const token =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN;

export const ratelimit: Ratelimit | null =
  url && token
    ? new Ratelimit({
        redis: new Redis({ url, token }),
        limiter: Ratelimit.slidingWindow(60, "60 s"),
        analytics: true,
        prefix: "cloud9-ratelimit",
      })
    : null;
