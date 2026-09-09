import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Circle, Truck } from "lucide-react";
import { PageHeader, SectionCard, StatusPill } from "@/components/ui-bits";
import { useData } from "@/lib/store";
import { inr, lotValue, recyclerById, traceSteps } from "@/lib/demo-data";

export const Route = createFileRoute("/collector/pickup")({
  component: TrackPickup,
});

const statusStep: Record<string, number> = {
  listed: 1,
  matched: 3,
  pickup_scheduled: 4,
  in_transit: 5,
  delivered: 6,
  paid: 8,
  cancelled: 0,
};

function TrackPickup() {
  const { lots, setLotStatus } = useData();
  const active = lots.filter(
    (l) =>
      l.collectorId === "C-101" &&
      ["matched", "pickup_scheduled", "in_transit", "delivered"].includes(l.status),
  );

  return (
    <div className="space-y-4">
      <PageHeader title="Track Pickup" subtitle="Live status of every scheduled handover." />
      {active.length === 0 ? (
        <p className="text-sm text-muted-foreground">No active pickups right now.</p>
      ) : null}
      {active.map((l) => {
        const step = statusStep[l.status] ?? 0;
        return (
          <SectionCard key={l.id} title={`${l.id} · ${l.material}`} action={<StatusPill status={l.status} />}>
            <p className="text-sm text-muted-foreground">
              {recyclerById(l.recyclerId ?? "")?.name ?? "Unassigned"} · {l.weightKg} kg ·{" "}
              {inr(lotValue(l))}
              {l.pickupSlot ? ` · ${l.pickupSlot}` : ""}
            </p>
            <ol className="mt-4 space-y-2">
              {traceSteps.map((s, i) => (
                <li key={s} className="flex items-center gap-3 text-sm">
                  {i < step ? (
                    <CheckCircle2 className="size-5 shrink-0 text-primary" />
                  ) : (
                    <Circle className="size-5 shrink-0 text-muted-foreground/50" />
                  )}
                  <span className={i < step ? "font-medium" : "text-muted-foreground"}>{s}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 flex flex-wrap gap-2">
              {l.status === "matched" ? (
                <button
                  onClick={() =>
                    setLotStatus(l.id, "pickup_scheduled", { pickupSlot: "Today, 6:00 PM" })
                  }
                  className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                >
                  Confirm pickup slot
                </button>
              ) : null}
              {l.status === "pickup_scheduled" ? (
                <button
                  onClick={() => setLotStatus(l.id, "in_transit")}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                >
                  <Truck className="size-4" /> Mark handed over
                </button>
              ) : null}
              {l.status === "in_transit" ? (
                <button
                  onClick={() => setLotStatus(l.id, "delivered")}
                  className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                >
                  Confirm delivery
                </button>
              ) : null}
            </div>
          </SectionCard>
        );
      })}
    </div>
  );
}
