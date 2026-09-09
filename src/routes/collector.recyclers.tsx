import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, MapPin, Phone, Star } from "lucide-react";
import { PageHeader } from "@/components/ui-bits";
import { recyclers } from "@/lib/demo-data";

export const Route = createFileRoute("/collector/recyclers")({
  component: FindRecycler,
});

function FindRecycler() {
  const [sort, setSort] = useState<"distance" | "rating">("distance");
  const [requested, setRequested] = useState<string[]>([]);
  const list = [...recyclers].sort((a, b) =>
    sort === "distance" ? a.distanceKm - b.distanceKm : b.rating - a.rating,
  );

  return (
    <div className="space-y-4">
      <PageHeader title="Find Recycler" subtitle="Verified facilities accepting material near you." />
      <div className="flex gap-2">
        {(["distance", "rating"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSort(s)}
            className={
              "rounded-full px-4 py-2 text-sm font-medium capitalize " +
              (sort === s ? "bg-primary text-primary-foreground" : "bg-secondary")
            }
          >
            Sort by {s}
          </button>
        ))}
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {list.map((r) => (
          <div key={r.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-1.5 font-semibold">
                  {r.name}
                  {r.verified ? <BadgeCheck className="size-4 text-primary" /> : null}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3.5" /> {r.city} · {r.distanceKm} km away
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
                <Star className="size-3.5 text-warning" /> {r.rating}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {r.materials.map((m) => (
                <span key={m} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
                  {m}
                </span>
              ))}
              <span className="rounded-full bg-secondary px-2.5 py-1 text-xs">
                {r.capacityTpd} TPD capacity
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setRequested((p) => (p.includes(r.id) ? p : [...p, r.id]))}
                className="flex-1 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
              >
                {requested.includes(r.id) ? "Request sent ✓" : "Request pickup"}
              </button>
              <a
                href={`tel:${r.mobile}`}
                className="grid w-14 place-items-center rounded-xl border border-border"
                aria-label={`Call ${r.name}`}
              >
                <Phone className="size-5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
