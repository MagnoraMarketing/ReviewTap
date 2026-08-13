import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { DestinationType, DeviceDestination, DevicePlan, DeviceStatus } from "@/types/database";

export interface RedirectTarget {
  deviceId: string;
  deviceStatus: DeviceStatus;
  devicePlan: DevicePlan;
  destinationType: DestinationType;
  destinationUrl: string | null;
  destinations: DeviceDestination[];
  subscriptionActive: boolean;
  businessName: string | null;
}

const PUBLIC_ID_PATTERN = /^RT-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6,10}$/;

export function isValidPublicId(value: string): boolean {
  return PUBLIC_ID_PATTERN.test(value);
}

/**
 * Single authoritative lookup used by every public entry point that touches
 * a device (direct redirect, the Pro chooser page, and its per-platform
 * click route) so status/subscription/destination checks can never drift
 * between them.
 */
export async function getRedirectTarget(publicId: string): Promise<RedirectTarget | null> {
  if (!isValidPublicId(publicId)) return null;

  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin
    .rpc("get_redirect_target", { p_public_id: publicId })
    .maybeSingle();

  if (error) {
    console.error("get_redirect_target failed", error);
    return null;
  }
  if (!data) return null;

  return {
    deviceId: data.device_id,
    deviceStatus: data.device_status,
    devicePlan: data.device_plan,
    destinationType: data.destination_type,
    destinationUrl: data.destination_url,
    destinations: (data.destinations ?? []) as DeviceDestination[],
    subscriptionActive: data.subscription_active,
    businessName: data.business_name,
  };
}
