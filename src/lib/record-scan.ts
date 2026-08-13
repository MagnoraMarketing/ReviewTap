import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { getApproxLocation, classifyDeviceType } from "@/lib/analytics";
import type { DestinationType, ScanType } from "@/types/database";

/**
 * Records a single visit. `destinationType` is null for a Pro chooser-page
 * landing (no platform picked yet) and set once a platform is clicked.
 */
export async function recordScan(
  deviceId: string,
  destinationType: DestinationType | null,
  headers: Headers,
) {
  const supabaseAdmin = createAdminClient();
  const { country, city } = getApproxLocation(headers);
  const userAgent = headers.get("user-agent");
  const scanType: ScanType = "UNKNOWN"; // NFC and QR share one URL - see /privacy.

  const { error } = await supabaseAdmin.from("scans").insert({
    device_id: deviceId,
    scan_type: scanType,
    destination_type: destinationType,
    user_agent: userAgent,
    referrer: headers.get("referer"),
    country,
    city,
    device_type: classifyDeviceType(userAgent),
  });

  if (error) {
    // Never block a redirect on analytics - log and continue.
    console.error("Failed to record scan", error);
  }
}
