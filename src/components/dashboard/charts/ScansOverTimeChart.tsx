"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export function ScansOverTimeChart({ data }: { data: { date: string; scans: number }[] }) {
  if (data.every((d) => d.scans === 0)) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        No review visits yet — scans will appear here once your ReviewTap is tapped or scanned.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="scansFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a63f0" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#3a63f0" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#eef0f4" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
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
        />
        <Area
          type="monotone"
          dataKey="scans"
          stroke="#3a63f0"
          strokeWidth={2}
          fill="url(#scansFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
