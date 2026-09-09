import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader, SectionCard, StatusPill } from "@/components/ui-bits";
import { useData } from "@/lib/store";
import { inr, lotValue, marketPrices, recyclerById, type Lot } from "@/lib/demo-data";

export const Route = createFileRoute("/collector/lots")({
  component: MyLots,
});

const categories = ["E-Waste", "Metal", "Plastic", "Paper", "Glass"] as const;
const filters = ["All", "Listed", "Matched", "Pickup", "Completed"] as const;

function matchesFilter(lot: Lot, f: (typeof filters)[number]) {
  if (f === "All") return true;
  if (f === "Listed") return lot.status === "listed";
  if (f === "Matched") return lot.status === "matched";
  if (f === "Pickup") return ["pickup_scheduled", "in_transit"].includes(lot.status);
  return ["delivered", "paid"].includes(lot.status);
}

function MyLots() {
  const { lots, addLot } = useData();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [open, setOpen] = useState(false);
  const [material, setMaterial] = useState("Mixed E-Waste");
  const [category, setCategory] = useState<(typeof categories)[number]>("E-Waste");
  const [weight, setWeight] = useState("25");
  const [rate, setRate] = useState("140");
  const [created, setCreated] = useState<string | null>(null);

  const myLots = lots.filter((l) => l.collectorId === "C-101").filter((l) => matchesFilter(l, filter));

  return (
    <div className="space-y-4">
      <PageHeader title="My Lots" subtitle="Create digital lots and track them until payment." />

      <SectionCard
        title="Sell E-Waste"
        action={
          <button
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="size-4" /> {open ? "Close" : "New lot"}
          </button>
        }
      >
        {open ? (
          <form
            className="grid gap-3 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              const lot = addLot({
                material,
                category,
                weightKg: Number(weight) || 1,
                ratePerKg: Number(rate) || 1,
                collectorId: "C-101",
                city: "Indore",
              });
              setCreated(lot.id);
              setOpen(false);
            }}
          >
            <label className="text-sm font-medium">
              Material
              <input
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-3 text-base"
              />
            </label>
            <label className="text-sm font-medium">
              Category
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as (typeof categories)[number])}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-3 text-base"
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              Weight (kg)
              <input
                inputMode="numeric"
                value={weight}
                onChange={(e) => setWeight(e.target.value.replace(/\D/g, ""))}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-3 text-base"
              />
            </label>
            <label className="text-sm font-medium">
              Expected rate (₹/kg)
              <input
                inputMode="numeric"
                value={rate}
                onChange={(e) => setRate(e.target.value.replace(/\D/g, ""))}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-3 text-base"
              />
            </label>
            <p className="text-sm text-muted-foreground sm:col-span-2">
              Estimated value:{" "}
              <span className="font-semibold text-foreground">
                {inr((Number(weight) || 0) * (Number(rate) || 0))}
              </span>
            </p>
            <button
              type="submit"
              className="rounded-xl bg-primary py-4 text-base font-semibold text-primary-foreground sm:col-span-2"
            >
              Publish lot to nearby recyclers
            </button>
          </form>
        ) : (
          <p className="text-sm text-muted-foreground">
            Today's best rate: {marketPrices[0]?.material} at ₹{marketPrices[0]?.rate}/kg. Create a lot
            to receive offers from verified recyclers near you.
          </p>
        )}
        {created ? (
          <p className="mt-3 rounded-xl bg-success/10 px-3 py-2 text-sm text-success">
            Lot {created} published successfully.
          </p>
        ) : null}
      </SectionCard>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium " +
              (filter === f ? "bg-primary text-primary-foreground" : "bg-secondary")
            }
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {myLots.map((l) => (
          <div key={l.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold">{l.material}</p>
                <p className="text-xs text-muted-foreground">
                  {l.id} · {l.category} · {l.createdAt}
                </p>
              </div>
              <StatusPill status={l.status} />
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Weight</dt>
                <dd className="font-medium">{l.weightKg} kg</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Rate</dt>
                <dd className="font-medium">₹{l.ratePerKg}/kg</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Value</dt>
                <dd className="font-medium text-primary">{inr(lotValue(l))}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">
              {l.recyclerId ? `Matched with ${recyclerById(l.recyclerId)?.name}` : "Awaiting offers"}
              {l.pickupSlot ? ` · Pickup ${l.pickupSlot}` : ""}
            </p>
          </div>
        ))}
        {myLots.length === 0 ? (
          <p className="text-sm text-muted-foreground">No lots in this filter yet.</p>
        ) : null}
      </div>
    </div>
  );
}
