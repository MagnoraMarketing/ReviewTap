import { z } from "zod";

export const DESTINATION_TYPES = [
  "GOOGLE_REVIEWS",
  "FACEBOOK",
  "TRUSTPILOT",
  "TRIPADVISOR",
  "CUSTOM_URL",
] as const;

export type DestinationTypeValue = (typeof DESTINATION_TYPES)[number];

/**
 * Loosely validates that a URL plausibly belongs to the expected review
 * platform. This is a UX guardrail, not a security boundary - we still
 * enforce HTTPS + safe-protocol rules for every destination type below.
 */
const PLATFORM_HOST_HINTS: Record<Exclude<DestinationTypeValue, "CUSTOM_URL">, string[]> = {
  GOOGLE_REVIEWS: ["google.com", "g.page", "goo.gl"],
  FACEBOOK: ["facebook.com", "fb.com", "fb.me"],
  TRUSTPILOT: ["trustpilot.com"],
  TRIPADVISOR: ["tripadvisor.com", "tripadvisor.co.uk", "tripadvisor."],
};

/**
 * Validates a destination URL is a safe, absolute HTTPS URL.
 * Rejects javascript:, data:, file:, and any other non-https protocol,
 * and rejects local/loopback hosts to reduce SSRF / open-redirect abuse
 * of the public /r/[deviceId] endpoint.
 */
export function isSafeDestinationUrl(rawUrl: string): boolean {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return false;
  }

  if (url.protocol !== "https:") return false;
  if (!url.hostname || url.hostname.length < 3) return false;

  const hostname = url.hostname.toLowerCase();
  const blockedHosts = ["localhost", "127.0.0.1", "0.0.0.0", "::1"];
  if (blockedHosts.includes(hostname)) return false;
  if (hostname.endsWith(".local")) return false;
  if (/^(10|127|169\.254|192\.168)\./.test(hostname)) return false;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(hostname)) return false;

  return true;
}

export function destinationUrlMatchesPlatform(
  destinationType: DestinationTypeValue,
  url: string,
): boolean {
  if (destinationType === "CUSTOM_URL") return true;
  const hints = PLATFORM_HOST_HINTS[destinationType];
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return hints.some((hint) => hostname.includes(hint));
  } catch {
    return false;
  }
}

export const updateDestinationSchema = z
  .object({
    destination_type: z.enum(DESTINATION_TYPES),
    destination_url: z
      .string()
      .trim()
      .min(1, "Please enter a URL")
      .max(2048)
      .refine(isSafeDestinationUrl, {
        message: "Please enter a valid, secure (https://) URL",
      }),
  })
  .refine(
    (data) => destinationUrlMatchesPlatform(data.destination_type, data.destination_url),
    {
      message: "This URL doesn't look like it belongs to the selected platform",
      path: ["destination_url"],
    },
  );

export const updateProfileSchema = z.object({
  business_name: z.string().trim().min(1).max(200).optional(),
  name: z.string().trim().min(1).max(200).optional(),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[0-9+\-() ]*$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
});

export const deviceNameSchema = z.string().trim().min(1, "Please enter a device name").max(100);

export const DEVICE_VARIANTS = ["STANDEE_CARD", "DESK_TILE"] as const;
export type DeviceVariant = (typeof DEVICE_VARIANTS)[number];

export const DEVICE_PLANS = ["BASIC", "PRO"] as const;
export type DevicePlanValue = (typeof DEVICE_PLANS)[number];

const destinationEntrySchema = z.object({
  type: z.enum(DESTINATION_TYPES),
  url: z
    .string()
    .trim()
    .max(2048)
    .refine((value) => value === "" || isSafeDestinationUrl(value), {
      message: "Please enter a valid, secure (https://) URL",
    }),
  enabled: z.boolean(),
});

/**
 * Pro devices let visitors choose among several enabled platforms at scan
 * time. At least one enabled destination must have a real URL configured.
 */
export const FEEDBACK_STATUSES = ["NEW", "READ", "RESOLVED"] as const;

export const submitFeedbackSchema = z.object({
  publicId: z.string().trim().min(1),
  rating: z.number().int().min(1).max(5),
  message: z.string().trim().max(2000).optional(),
});

export const attachFeedbackMessageSchema = z.object({
  message: z.string().trim().min(1, "Please enter a message").max(2000),
});

export const updateFeedbackStatusSchema = z.object({
  status: z.enum(FEEDBACK_STATUSES),
});

export const updateDestinationsSchema = z
  .object({ destinations: z.array(destinationEntrySchema).max(DESTINATION_TYPES.length) })
  .refine(
    (data) => data.destinations.some((d) => d.enabled && d.url && isSafeDestinationUrl(d.url)),
    { message: "Enable at least one platform with a valid URL", path: ["destinations"] },
  )
  .refine(
    (data) => data.destinations.every((d) => !d.enabled || !d.url || destinationUrlMatchesPlatform(d.type, d.url)),
    { message: "One of your URLs doesn't look like it belongs to the selected platform", path: ["destinations"] },
  );
