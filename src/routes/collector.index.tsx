import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  IndianRupee,
  Leaf,
  Package,
  Receipt,
  Search,
  ShieldCheck,
  Smartphone,
  Tags,
  Truck,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionCard, StatCard, StatusPill, TxnPill } from "@/components/ui-bits";
import { useData } from "@/lib/store";
import { inr, lotValue, recyclerById } from "@/lib/demo-data";

export const Route = createFileRoute("/collector/")({
  component: CollectorDashboard,
});

const actions: { label: string; to: string; icon: LucideIcon }[] = [
  { label: "Sell E-Waste", to: "/collector/lots", icon: Package },
  { label: "Check Prices", to: "/collector/prices", icon: Tags },
  { label: "Find Recycler", to: "/collector/recyclers", icon: Search },
  { label: "My Lots", to: "/collector/lots", icon: Smartphone },
  { label: "Track Pickup", to: "/collector/pickup", icon: Truck },
  { label: "Earnings", to: "/collector/earnings", icon: IndianRupee },
  { label: "Transactions", to: "/collector/transactions", icon: Receipt },
  { label: "Safety", to: "/collector/safety", icon: ShieldCheck },
];

function CollectorDashboard() {
  const { lots, transactions, notifications } = useData();
  const myLots = lots.filter((l) => l.collectorId === "C-101");
  const myTxns = transactions.filter((t) => t.collectorId === "C-101");
  const activeLots = myLots.filter((l) =>
    ["listed", "matched", "pickup_scheduled", "in_transit"].includes(l.status),
  );
  const totalKg = myLots.reduce((s, l) => s + l.weightKg, 0);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Namaste, Ramesh 👋</h1>
            <p className="text-sm text-muted-foreground">Ward 12, Indore · Verified collector</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-success/15 px-3 py-1.5 text-xs font-medium text-success">
            <span className="size-2 rounded-full bg-success" /> Online
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Today's Earnings" value="₹850" icon={Wallet} tone="primary" />
        <StatCard label="Active Lots" value={activeLots.length || 3} icon={Package} tone="info" />
        <StatCard label="Pending Payment" value="₹1,250" icon={IndianRupee} tone="warning" />
        <StatCard label="Total Earnings" value="₹25,450" icon={Receipt} />
      </div>

      <SectionCard title="Quick actions">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {actions.map((a) => (
            <Link
              key={a.label}
              to={a.to}
              className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-secondary/50 p-3 text-center text-sm font-medium hover:bg-secondary"
            >
              <a.icon className="size-6 text-primary" />
              {a.label}
            </Link>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Recent Lots"
          action={
            <Link to="/collector/lots" className="text-sm font-medium text-primary">
              View all
            </Link>
          }
        >
          <ul className="divide-y divide-border">
            {myLots.slice(0, 4).map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{l.material}</p>
                  <p className="text-xs text-muted-foreground">
                    {l.id} · {l.weightKg} kg · {inr(lotValue(l))}
                  </p>
                </div>
                <StatusPill status={l.status} />
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Recent Transactions"
          action={
            <Link to="/collector/transactions" className="text-sm font-medium text-primary">
              View all
            </Link>
          }
        >
          <ul className="divide-y divide-border">
            {myTxns.slice(0, 4).map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{inr(t.amount)}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.id} · {recyclerById(t.recyclerId)?.name} · {t.mode}
                  </p>
                </div>
                <TxnPill status={t.status} />
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Notifications"
          action={
            <Link to="/collector/notifications" className="text-sm font-medium text-primary">
              View all
            </Link>
          }
        >
          <ul className="space-y-3">
            {notifications.slice(0, 4).map((n) => (
              <li key={n.id} className="flex gap-3">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Bell className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Green Impact">
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { k: `${totalKg} kg`, v: "Diverted from landfill" },
              { k: `${Math.round(totalKg * 1.6)} kg`, v: "CO₂e avoided" },
              { k: `${myLots.length}`, v: "Traceable lots" },
            ].map((i) => (
              <div key={i.v} className="rounded-2xl bg-primary/5 p-3">
                <p className="text-lg font-semibold text-primary">{i.k}</p>
                <p className="mt-1 text-xs text-muted-foreground">{i.v}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Leaf className="size-4 text-primary" /> Every digital lot adds to India's formal
            recycling record.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
