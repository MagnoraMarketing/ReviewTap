import "server-only";

/**
 * Privacy-conscious scan analytics helpers.
 *
 * ReviewTap does NOT store full IP addresses. When approximate
 * country/city is available it comes from Vercel's edge network geo
 * headers (no external IP-lookup service, no full IP retained). If those
 * headers aren't present (e.g. local dev, non-Vercel hosting) we simply
 * store no location data rather than falling back to raw-IP geolocation.
 * IP addresses are used transiently, in memory only, as a rate-limit key
 * (see lib/rate-limit.ts) and are never persisted to the database.
 *
 * See /privacy for the user-facing explanation of what is collected.
 */

export function getApproxLocation(headers: Headers): { country: string | null; city: string | null } {
  const country = headers.get("x-vercel-ip-country");
  const city = headers.get("x-vercel-ip-city");
  return {
    country: country || null,
    city: city ? decodeURIComponent(city) : null,
  };
}

export function classifyDeviceType(userAgent: string | null): string | null {
  if (!userAgent) return null;
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet/.test(ua)) return "tablet";
  if (/mobile|iphone|android/.test(ua)) return "mobile";
  if (/bot|crawler|spider|preview/.test(ua)) return "bot";
  return "desktop";
}
