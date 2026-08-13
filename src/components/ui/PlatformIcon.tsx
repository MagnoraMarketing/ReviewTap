import { DESTINATION_COLORS } from "@/lib/display";
import type { DestinationType } from "@/types/database";

const GLYPH: Record<DestinationType, string> = {
  GOOGLE_REVIEWS: "G",
  FACEBOOK: "f",
  TRUSTPILOT: "★",
  TRIPADVISOR: "T",
  CUSTOM_URL: "🔗",
};

export function PlatformIcon({ type, className }: { type: DestinationType; className?: string }) {
  return (
    <span
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-bold text-white ${className ?? ""}`}
      style={{ backgroundColor: DESTINATION_COLORS[type] }}
      aria-hidden
    >
      {GLYPH[type]}
    </span>
  );
}
