import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader, SectionCard, StatCard } from "@/components/ui-bits";
import {
  cityCollection,
  growthData,
  inr,
  materialDistribution,
  monthlyCollection,
  transactionTrends,
} from "@/lib/demo-data";
import { BarChart3, Scale, TrendingUp, Users } from "lucide-react";

export const Route = createFileRoute("/admin/analytics")({
  component: Analytics,
});

const pieColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function Analytics() {
  return (
    <div className="space-y-4">
      <PageHeader title="Analytics" subtitle="Deep dive into collection, value and growth." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Avg. monthly growth" value="+18.4%" icon={TrendingUp} tone="primary" />
        <StatCard label="Material this month" value="24.8 T" icon={Scale} />
        <StatCard label="Avg. lot value" value={inr(4360)} icon={BarChart3} tone="info" />
        <StatCard label="New collectors (Aug)" value="294" icon={Users} tone="primary" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Collection vs Lots">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyCollection}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Legend />
                <Tooltip />
                <Bar dataKey="kg" name="Kg collected" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="lots" name="Lots" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="City-wise collection (kg)">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityCollection} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis
                  type="category"
                  dataKey="city"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  width={70}
                />
                <Tooltip />
                <Bar dataKey="kg" fill="var(--chart-1)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Material mix">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={materialDistribution} dataKey="value" nameKey="name" outerRadius={90} label>
                  {materialDistribution.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Transaction value & network growth">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={transactionTrends.map((t, i) => ({ ...t, collectors: growthData[i]?.collectors ?? 0 }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis
                  yAxisId="left"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  tickFormatter={(v: number) => `${v / 100000}L`}
                />
                <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} fontSize={12} />
                <Legend />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="value"
                  name="Transaction value"
                  stroke="var(--chart-1)"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="collectors"
                  name="Collectors"
                  stroke="var(--chart-4)"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
