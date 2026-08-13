import type { DeviceVariant } from "@/types/database";

function TapMark({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke="#3a63f0" strokeWidth="2.4" strokeLinecap="round" fill="none">
      <path d="M0 12a12 12 0 0 1 12-12" opacity="0.4" />
      <path d="M4 12a8 8 0 0 1 8-8" opacity="0.7" />
      <path d="M8 12a4 4 0 0 1 4-4" />
    </g>
  );
}

const QR_CELLS: [number, number][] = [
  [0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2],
  [4, 0], [4, 1], [4, 2],
  [0, 4], [1, 4], [2, 4], [4, 4], [3, 3], [1, 3],
];

function QrGlyph({ x, y, size }: { x: number; y: number; size: number }) {
  const cell = size / 5;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={size} height={size} rx={size * 0.08} fill="#ffffff" stroke="#e5e7eb" />
      {QR_CELLS.map(([cx, cy]) => (
        <rect
          key={`${cx}-${cy}`}
          x={cx * cell + cell * 0.4}
          y={cy * cell + cell * 0.4}
          width={cell * 0.6}
          height={cell * 0.6}
          rx={1}
          fill="#0b0f1a"
        />
      ))}
    </g>
  );
}

/**
 * Clean vector product mockups for the two ReviewTap hardware variants.
 * Stand-ins for real product photography.
 */
export function DeviceMockup({ variant, className }: { variant: DeviceVariant; className?: string }) {
  if (variant === "DESK_TILE") {
    return (
      <svg viewBox="0 0 240 220" className={className} role="img" aria-label="ReviewTap desk tile">
        <ellipse cx="120" cy="196" rx="86" ry="12" fill="#0b0f1a" opacity="0.06" />
        <g transform="translate(30 26) skewY(-6)">
          <rect width="180" height="150" rx="20" fill="#141a2a" />
          <rect x="6" y="6" width="168" height="138" rx="15" fill="#1e2740" />
          <QrGlyph x={30} y={24} size={70} />
          <TapMark x={118} y={30} />
          <text x="30" y="122" fill="#ffffff" fontSize="13" fontWeight="600" fontFamily="sans-serif">
            Scan to review
          </text>
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 240 220" className={className} role="img" aria-label="ReviewTap standee card">
      <ellipse cx="120" cy="200" rx="70" ry="10" fill="#0b0f1a" opacity="0.06" />
      <path d="M70 200 L74 96 L166 96 L170 200 Z" fill="#0b0f1a" opacity="0.08" />
      <rect x="72" y="20" width="96" height="150" rx="14" fill="#141a2a" />
      <rect x="78" y="26" width="84" height="138" rx="10" fill="#1e2740" />
      <QrGlyph x={92} y={44} size={56} />
      <TapMark x={112} y={112} />
      <text x="90" y="150" fill="#ffffff" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        Leave us a
      </text>
      <text x="90" y="163" fill="#ffffff" fontSize="11" fontWeight="600" fontFamily="sans-serif">
        review
      </text>
    </svg>
  );
}
