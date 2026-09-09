import { createFileRoute } from "@tanstack/react-router";
import { Truck } from "lucide-react";
import { PageHeader, SectionCard, StatusPill } from "@/components/ui-bits";
import { useData } from "@/lib/store";
import { collectorById, inr, lotValue } from "@/lib/demo-data";

export const Route = createFileRoute("/recycler/pickups")({
  component: Pickups,
});

function Pickups() {
  const { lots, setLotStatus, settlePayment } = useData();
  const rows = lots.filter((l) =>
    ["pickup_scheduled", "in_transit", "delivered"].includes(l.status),
  );

  return (
    <div className="space-y-4">
      <PageHeader title="Pickups" subtitle="Assign vehicles and confirm digital handover." />
      <SectionCard title="Today's route">
        <p className="text-sm text-muted-foreground">
          {rows.length} stops · Vehicle MP09-EV-2043 · Driver: Sanjay
        </p>
      </SectionCard>
      <div className="grid gap-3 lg:grid-cols-2">
        {rows.map((l) => (
          <div key={l.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {l.id} · {l.material}
                </p>
                <p className="text-xs text-muted-foreground">
                  {collectorById(l.collectorId)?.name} · {l.city} · {l.pickupSlot ?? "Slot pending"}
                </p>
              </div>
              <StatusPill status={l.status} />
            </div>
            <p className="mt-3 text-sm">
              {l.weightKg} kg · ₹{l.ratePerKg}/kg ·{" "}
              <span className="font-semibold text-primary">{inr(lotValue(l))}</span>
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {l.status === "pickup_scheduled" ? (
                <button
                  onClick={() => setLotStatus(l.id, "in_transit")}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                >
                  <Truck className="size-4" /> Start pickup
                </button>
              ) : null}
              {l.status === "in_transit" ? (
                <button
                  onClick={() => setLotStatus(l.id, "delivered")}
                  className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                >
                  Confirm weighing & handover
                </button>
              ) : null}
              {l.status === "delivered" ? (
                <button
                  onClick={() => settlePayment(l.id)}
                  className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                >
                  Release payment
                </button>
              ) : null}
            </div>
          </div>
        ))}
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pickups scheduled.</p>
        ) : null}
      </div>
    </div>
  );
}
