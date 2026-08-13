import "server-only";

/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * This is process-local, so on serverless/edge deployments with multiple
 * concurrent instances it only bounds abuse per-instance, not globally.
 * It is intentionally dependency-free for the MVP. For stricter guarantees
 * in production, swap this for a shared store (e.g. Upstash Redis /
 * @upstash/ratelimit) behind the same `checkRateLimit` signature.
 */

interface Bucket {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, Bucket>();

// Periodically drop stale buckets so memory doesn't grow unbounded.
const MAX_BUCKETS = 50_000;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now - existing.windowStart >= windowMs) {
    if (buckets.size >= MAX_BUCKETS) {
      buckets.clear();
    }
    buckets.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.windowStart + windowMs,
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: limit - existing.count,
    resetAt: existing.windowStart + windowMs,
  };
}

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }
  return headers.get("x-real-ip") ?? "unknown";
}
