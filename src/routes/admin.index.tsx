import { createFileRoute } from "@tanstack/react-router";
import {
  BadgeCheck,
  Boxes,
  CheckCircle2,
  IndianRupee,
  Package,
  Receipt,
  Recycle,
  Scale,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
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
  completedVsPending,
  growthData,
  inr,
  materialDistribution,
  monthlyCollection,
  transactionTrends,
} from "@/lib/demo-data";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const pieColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function AdminDashboard() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Government Monitoring"
        subtitle="National view of formalisation, collection and transaction flows."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Total Collectors" value="1,684" icon={Users} tone="primary" />
        <StatCard label="Verified Collectors" value="1,209" icon={BadgeCheck} tone="primary" />
        <StatCard label="Active Collectors" value="947" icon={Users} tone="info" />
        <StatCard label="Total Recyclers" value="82" icon={Recycle} />
        <StatCard label="Verified Recyclers" value="71" icon={BadgeCheck} />
        <StatCard label="Active Lots" value="316" icon={Package} tone="warning" />
        <StatCard label="Completed Lots" value="1,842" icon={CheckCircle2} />
        <StatCard label="Total E-Waste Collected" value="106.4 T" icon={Scale} tone="primary" />
        <StatCard label="Total Transaction Value" value={inr(8030000)} icon={IndianRupee} />
        <StatCard label="Completed Transactions" value="1,842" icon={Receipt} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Monthly Collection (kg)">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyCollection}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="kg" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Material Distribution (%)">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={materialDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                >
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

        <SectionCard title="Transaction Trends (₹)">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transactionTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  tickFormatter={(v: number) => `${v / 100000}L`}
                />
                <Tooltip formatter={(v: number) => inr(v)} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--chart-1)"
                  fill="var(--chart-1)"
                  fillOpacity={0.18}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Completed vs Pending Lots">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={completedVsPending}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  <Cell fill="var(--chart-1)" />
                  <Cell fill="var(--chart-3)" />
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Collector Growth">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="collectors"
                  stroke="var(--chart-1)"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Recycler Growth">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="recyclers"
                  stroke="var(--chart-2)"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Boxes className="size-4" /> Figures are prototype demo data for SIH26229.
      </p>
    </div>
  );
}
