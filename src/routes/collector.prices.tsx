import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/ui-bits";
import { marketPrices } from "@/lib/demo-data";

export const Route = createFileRoute("/collector/prices")({
  component: Prices,
});

const cats = ["All", "E-Waste", "Metal", "Plastic", "Paper", "Glass"];

function Prices() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const rows = marketPrices.filter(
    (p) =>
      (cat === "All" || p.category === cat) &&
      p.material.toLowerCase().includes(q.toLowerCase().trim()),
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Today's Prices"
        subtitle="Transparent ward-level rates, updated every morning · Indore"
      />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search material"
        className="w-full rounded-xl border border-border bg-card px-4 py-3.5 text-base"
      />
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
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((p) => (
          <div key={p.material} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <p className="text-xs text-muted-foreground">{p.category}</p>
            <p className="mt-1 font-semibold">{p.material}</p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-2xl font-bold text-primary">₹{p.rate}</p>
              <span
                className={
                  "inline-flex items-center gap-1 text-sm font-medium " +
                  (p.change >= 0 ? "text-success" : "text-destructive")
                }
              >
                {p.change >= 0 ? (
                  <TrendingUp className="size-4" />
                ) : (
                  <TrendingDown className="size-4" />
                )}
                {Math.abs(p.change)}%
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">per {p.unit}</p>
          </div>
        ))}
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No material matches your search.</p>
        ) : null}
      </div>
    </div>
  );
}
