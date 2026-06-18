"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompact, formatPrice } from "@/lib/utils";

interface ChartDatum {
  name: string;
  revenue: number;
  sales: number;
}

function shorten(title: string): string {
  return title.length > 12 ? `${title.slice(0, 12)}…` : title;
}

export function RevenueChart({ courses }: { courses: ChartDatum[] }) {
  if (courses.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-[var(--radius-lg)] border border-border bg-surface text-sm text-subtle">
        Hali ma&apos;lumot yo&apos;q
      </div>
    );
  }

  const data = courses.map((c) => ({ ...c, short: shorten(c.name) }));

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-4">
      <p className="mb-4 text-sm font-semibold text-foreground">
        Kurslar bo&apos;yicha daromad
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          <XAxis
            dataKey="short"
            tick={{ fill: "#d8b796", fontSize: 11 }}
            axisLine={{ stroke: "#532410" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => formatCompact(Number(v))}
            tick={{ fill: "#d8b796", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={44}
          />
          <Tooltip
            cursor={{ fill: "#e5842318" }}
            contentStyle={{
              background: "#3d1202",
              border: "1px solid #532410",
              borderRadius: 12,
              color: "#fbeee0",
              fontSize: 12,
            }}
            formatter={(value) => [formatPrice(Number(value)), "Daromad"]}
          />
          <Bar dataKey="revenue" fill="#e58423" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
