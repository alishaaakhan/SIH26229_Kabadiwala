import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Boxes,
  CheckCircle2,
  Handshake,
  IndianRupee,
  Receipt,
  Scale,
  Truck,
  Wallet,
} from "lucide-react";
import { SectionCard, StatCard, StatusPill, TxnPill } from "@/components/ui-bits";
import { useData } from "@/lib/store";
import { collectorById, inr, lotValue } from "@/lib/demo-data";

export const Route = createFileRoute("/recycler/")({
  component: RecyclerDashboard,
});

function RecyclerDashboard() {
  const { lots, transactions } = useData();
  const incoming = lots.filter((l) => l.status === "listed");
  const mine = lots.filter((l) => l.recyclerId === "R-201");
  const pickups = lots.filter((l) =>
    ["pickup_scheduled", "in_transit"].includes(l.status),
  );
  const txns = transactions.filter((t) => t.recyclerId === "R-201");

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <h1 className="text-xl font-semibold tracking-tight">Green Recycling Facility</h1>
        <p className="text-sm text-muted-foreground">
          Indore · Verified recycler · 24 TPD capacity
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Incoming Requests" value={12} icon={Boxes} tone="info" />
        <StatCard label="Accepted Lots" value={8} icon={Handshake} tone="primary" />
        <StatCard label="Today's Procurement" value="₹18,450" icon={Wallet} tone="primary" />
        <StatCard label="Monthly Procurement" value="₹3,45,000" icon={IndianRupee} />
        <StatCard label="Material Received" value="428 kg" icon={Scale} />
        <StatCard label="Pending Payments" value="₹24,500" icon={IndianRupee} tone="warning" />
        <StatCard label="Completed Transactions" value={86} icon={CheckCircle2} />
        <StatCard label="Active Pickups" value={pickups.length} icon={Truck} tone="info" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Incoming Lots"
          action={
            <Link to="/recycler/incoming" className="text-sm font-medium text-primary">
              View all
            </Link>
          }
        >
          <ul className="divide-y divide-border">
            {incoming.slice(0, 4).map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{l.material}</p>
                  <p className="text-xs text-muted-foreground">
                    {collectorById(l.collectorId)?.name} · {l.weightKg} kg · {inr(lotValue(l))}
                  </p>
                </div>
                <StatusPill status={l.status} />
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Active Pickups"
          action={
            <Link to="/recycler/pickups" className="text-sm font-medium text-primary">
              Manage
            </Link>
          }
        >
          <ul className="divide-y divide-border">
            {pickups.slice(0, 4).map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {l.id} · {l.material}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {l.pickupSlot ?? "Slot pending"} · {l.city}
                  </p>
                </div>
                <StatusPill status={l.status} />
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Offers"
          action={
            <Link to="/recycler/offers" className="text-sm font-medium text-primary">
              View offers
            </Link>
          }
        >
          <ul className="divide-y divide-border">
            {mine.slice(0, 4).map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{l.material}</p>
                  <p className="text-xs text-muted-foreground">
                    Offered ₹{l.ratePerKg}/kg · {l.weightKg} kg
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
            <Link to="/recycler/transactions" className="text-sm font-medium text-primary">
              View all
            </Link>
          }
        >
          <ul className="divide-y divide-border">
            {txns.slice(0, 4).map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="font-medium">{inr(t.amount)}</p>
                  <p className="text-xs text-muted-foreground">
                    {collectorById(t.collectorId)?.name} · {t.mode} · {t.date}
                  </p>
                </div>
                <TxnPill status={t.status} />
              </li>
            ))}
            {txns.length === 0 ? (
              <li className="py-3 text-sm text-muted-foreground">No transactions yet.</li>
            ) : null}
          </ul>
        </SectionCard>
      </div>
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Receipt className="size-4" /> All procurement records are export-ready for EPR compliance.
      </p>
    </div>
  );
}
