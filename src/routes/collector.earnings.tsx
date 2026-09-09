import { createFileRoute } from "@tanstack/react-router";
import { IndianRupee, TrendingUp, Wallet } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader, SectionCard, StatCard, TxnPill } from "@/components/ui-bits";
import { useData } from "@/lib/store";
import { inr } from "@/lib/demo-data";

export const Route = createFileRoute("/collector/earnings")({
  component: Earnings,
});

const weekly = [
  { day: "Mon", amount: 620 },
  { day: "Tue", amount: 980 },
  { day: "Wed", amount: 450 },
  { day: "Thu", amount: 1340 },
  { day: "Fri", amount: 760 },
  { day: "Sat", amount: 1520 },
  { day: "Sun", amount: 850 },
];

function Earnings() {
  const { transactions } = useData();
  const mine = transactions.filter((t) => t.collectorId === "C-101");
  const paid = mine.filter((t) => t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const pending = mine.filter((t) => t.status !== "completed").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-4">
      <PageHeader title="Earnings" subtitle="Digital settlement history and pending payouts." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Today" value="₹850" icon={Wallet} tone="primary" />
        <StatCard label="This week" value={inr(6520)} icon={TrendingUp} tone="info" />
        <StatCard label="Settled" value={inr(paid)} icon={IndianRupee} />
        <StatCard label="Pending" value={inr(pending)} icon={IndianRupee} tone="warning" />
      </div>

      <SectionCard title="This week's earnings">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip formatter={(v: number) => inr(v)} />
              <Bar dataKey="amount" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard title="Payout history">
        <ul className="divide-y divide-border">
          {mine.map((t) => (
            <li key={t.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="font-medium">{inr(t.amount)}</p>
                <p className="text-xs text-muted-foreground">
                  {t.date} · {t.mode} · {t.lotId}
                </p>
              </div>
              <TxnPill status={t.status} />
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
