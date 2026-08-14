"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DESTINATION_COLORS, DESTINATION_LABELS } from "@/lib/display";
import type { DestinationType } from "@/types/database";

export function ReviewsByPlatformChart({ data }: { data: { destination: string; count: number }[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  if (total === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-center text-sm text-gray-400">
        No review visits on an enabled platform yet.
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: DESTINATION_LABELS[d.destination as DestinationType] ?? d.destination,
    count: d.count,
    key: d.destination,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
          interval={0}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
          width={32}
        />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
          labelStyle={{ fontWeight: 600 }}
          cursor={{ fill: "#f3f4f6" }}
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {chartData.map((entry) => (
            <Cell key={entry.key} fill={DESTINATION_COLORS[entry.key as DestinationType] ?? "#9ca3af"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
