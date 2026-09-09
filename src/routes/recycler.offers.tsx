import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusPill } from "@/components/ui-bits";
import { useData } from "@/lib/store";
import { collectorById, inr, lotValue } from "@/lib/demo-data";

export const Route = createFileRoute("/recycler/offers")({
  component: Offers,
});

function Offers() {
  const { lots, setLotStatus } = useData();
  const rows = lots.filter(
    (l) => l.recyclerId === "R-201" || ["matched", "pickup_scheduled"].includes(l.status),
  );

  return (
    <div className="space-y-4">
      <PageHeader title="Offers" subtitle="Offers you have made and their current stage." />
      <div className="grid gap-3 lg:grid-cols-2">
        {rows.map((l) => (
          <div key={l.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{l.material}</p>
                <p className="text-xs text-muted-foreground">
                  {l.id} · {collectorById(l.collectorId)?.name} · {l.city}
                </p>
              </div>
              <StatusPill status={l.status} />
            </div>
            <p className="mt-3 text-sm">
              Offer: <span className="font-semibold">₹{l.ratePerKg}/kg</span> · {l.weightKg} kg ·{" "}
              <span className="font-semibold text-primary">{inr(lotValue(l))}</span>
            </p>
            <div className="mt-4 flex gap-2">
              {l.status === "matched" ? (
                <button
                  onClick={() =>
                    setLotStatus(l.id, "pickup_scheduled", { pickupSlot: "Tomorrow, 10:00 AM" })
                  }
                  className="flex-1 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
                >
                  Schedule pickup
                </button>
              ) : null}
              {l.status === "listed" ? (
                <button
                  onClick={() => setLotStatus(l.id, "matched", { recyclerId: "R-201" })}
                  className="flex-1 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
                >
                  Send offer
                </button>
              ) : null}
              {["pickup_scheduled", "in_transit", "delivered", "paid"].includes(l.status) ? (
                <p className="text-sm text-muted-foreground">
                  {l.pickupSlot ? `Pickup: ${l.pickupSlot}` : "Handover in progress"}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
