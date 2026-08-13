import { DESTINATION_COLORS, DESTINATION_LABELS } from "@/lib/display";
import type { DestinationType } from "@/types/database";

const GLYPH: Record<DestinationType, string> = {
  GOOGLE_REVIEWS: "G",
  FACEBOOK: "f",
  TRUSTPILOT: "★",
  TRIPADVISOR: "T",
  CUSTOM_URL: "🔗",
};

const QR_CELLS: [number, number][] = [
  [0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2],
  [4, 0], [4, 1], [4, 2],
  [0, 4], [1, 4], [2, 4], [4, 4], [3, 3], [1, 3],
];

/**
 * Marketing card mockup for a single fixed platform (Basic plan), styled
 * after a printed review-card layout: platform badge, "tap or scan" copy,
 * NFC glyph, and a small QR glyph.
 */
export function PlatformCardMockup({
  type,
  className,
}: {
  type: DestinationType;
  className?: string;
}) {
  const color = DESTINATION_COLORS[type];
  const cell = 40 / 5;

  return (
    <svg viewBox="0 0 240 160" className={className} role="img" aria-label={`${DESTINATION_LABELS[type]} review card`}>
      <rect width="240" height="160" rx="16" fill="#ffffff" stroke="#e5e7eb" />
      <rect width="240" height="56" rx="16" fill={color} />
      <rect y="40" width="240" height="16" fill={color} />
      <circle cx="30" cy="28" r="16" fill="#ffffff" />
      <text x="30" y="34" textAnchor="middle" fontSize="16" fontWeight="700" fill={color} fontFamily="sans-serif">
        {GLYPH[type]}
      </text>
      <text x="56" y="24" fontSize="13" fontWeight="700" fill="#ffffff" fontFamily="sans-serif">
        {DESTINATION_LABELS[type]}
      </text>
      <text x="56" y="40" fontSize="10" fill="#ffffff" fillOpacity="0.9" fontFamily="sans-serif">
        Leave us a review
      </text>

      <g transform="translate(24 76)" stroke="#0b0f1a" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M0 24a24 24 0 0 1 24-24" opacity="0.35" />
        <path d="M6 24a18 18 0 0 1 18-18" opacity="0.6" />
        <path d="M12 24a12 12 0 0 1 12-12" opacity="0.85" />
      </g>
      <text x="24" y="128" fontSize="10" fontWeight="600" fill="#0b0f1a" fontFamily="sans-serif">
        Tap
      </text>

      <g transform="translate(160 76)">
        <rect width="40" height="40" rx="4" fill="#ffffff" stroke="#e5e7eb" />
        {QR_CELLS.map(([cx, cy]) => (
          <rect
            key={`${cx}-${cy}`}
            x={cx * cell + cell * 0.35}
            y={cy * cell + cell * 0.35}
            width={cell * 0.55}
            height={cell * 0.55}
            fill="#0b0f1a"
          />
        ))}
      </g>
      <text x="160" y="128" fontSize="10" fontWeight="600" fill="#0b0f1a" fontFamily="sans-serif">
        Scan
      </text>
    </svg>
  );
}
