import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Star } from "lucide-react";
import { PageHeader, StatusPill } from "@/components/ui-bits";
import { useData } from "@/lib/store";
import { collectorById, inr, lotValue } from "@/lib/demo-data";

export const Route = createFileRoute("/recycler/incoming")({
  component: IncomingLots,
});

const cats = ["All", "E-Waste", "Metal", "Plastic", "Paper", "Glass"];

function IncomingLots() {
  const { lots, acceptLot } = useData();
  const [cat, setCat] = useState("All");
  const rows = lots
    .filter((l) => l.status === "listed")
    .filter((l) => cat === "All" || l.category === cat);

  return (
    <div className="space-y-4">
      <PageHeader title="Incoming Lots" subtitle="Open lots published by nearby collectors." />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium " +
              (cat === c ? "bg-primary text-primary-foreground" : "bg-secondary")
            }
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {rows.map((l) => {
          const c = collectorById(l.collectorId);
          return (
            <div key={l.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{l.material}</p>
                  <p className="text-xs text-muted-foreground">
                    {l.id} · {l.category} · listed {l.createdAt}
                  </p>
                </div>
                <StatusPill status={l.status} />
              </div>
              <p className="mt-3 flex items-center gap-2 text-sm">
                {c?.name}
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="size-3.5 text-warning" /> {c?.rating}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3.5" /> {l.city}
                </span>
              </p>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Weight</dt>
                  <dd className="font-medium">{l.weightKg} kg</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Ask rate</dt>
                  <dd className="font-medium">₹{l.ratePerKg}/kg</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Lot value</dt>
                  <dd className="font-medium text-primary">{inr(lotValue(l))}</dd>
                </div>
              </dl>
              <button
                onClick={() => acceptLot(l.id, "R-201")}
                className="mt-4 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
              >
                Accept lot & send offer
              </button>
            </div>
          );
        })}
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No open lots in this category.</p>
        ) : null}
      </div>
    </div>
  );
}
