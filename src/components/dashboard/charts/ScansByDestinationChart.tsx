"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS: Record<string, string> = {
  GOOGLE_REVIEWS: "#4285F4",
  FACEBOOK: "#1877F2",
  TRUSTPILOT: "#00b67a",
  TRIPADVISOR: "#34e0a1",
  CUSTOM_URL: "#9ca3af",
};

const LABELS: Record<string, string> = {
  GOOGLE_REVIEWS: "Google Reviews",
  FACEBOOK: "Facebook",
  TRUSTPILOT: "Trustpilot",
  TRIPADVISOR: "Tripadvisor",
  CUSTOM_URL: "Custom URL",
};

export function ScansByDestinationChart({ data }: { data: { destination: string; count: number }[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  if (total === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        No destination clicks yet.
      </div>
    );
  }

  const chartData = data
    .filter((d) => d.count > 0)
    .map((d) => ({ name: LABELS[d.destination] ?? d.destination, value: d.count, key: d.destination }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
          {chartData.map((entry) => (
            <Cell key={entry.key} fill={COLORS[entry.key] ?? "#9ca3af"} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
