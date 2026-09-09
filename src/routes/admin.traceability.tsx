import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Circle, Search } from "lucide-react";
import { PageHeader, SectionCard, StatusPill } from "@/components/ui-bits";
import { useData } from "@/lib/store";
import { collectorById, inr, lotValue, recyclerById, traceSteps } from "@/lib/demo-data";

export const Route = createFileRoute("/admin/traceability")({
  component: Traceability,
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

function Traceability() {
  const { lots } = useData();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string>(lots[0]?.id ?? "");
  const results = lots.filter((l) => l.id.toLowerCase().includes(q.toLowerCase().trim()));
  const lot = lots.find((l) => l.id === selected) ?? results[0];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Traceability"
        subtitle="Follow any lot from street collection to formal recycling."
      />
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3">
        <Search className="size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search lot ID e.g. LOT-1003"
          className="w-full bg-transparent py-3.5 text-base outline-none"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <SectionCard title="Lots">
          <ul className="max-h-96 space-y-2 overflow-y-auto">
            {results.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => setSelected(l.id)}
                  className={
                    "w-full rounded-xl border border-border p-3 text-left text-sm " +
                    (lot?.id === l.id ? "bg-primary/10" : "bg-card")
                  }
                >
                  <span className="block font-medium">{l.id}</span>
                  <span className="block text-xs text-muted-foreground">
                    {l.material} · {l.city}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </SectionCard>

        {lot ? (
          <SectionCard title={`Chain of custody · ${lot.id}`} action={<StatusPill status={lot.status} />}>
            <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-xs text-muted-foreground">Collector</dt>
                <dd className="font-medium">{collectorById(lot.collectorId)?.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Recycler</dt>
                <dd className="font-medium">
                  {lot.recyclerId ? recyclerById(lot.recyclerId)?.name : "Unmatched"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Weight</dt>
                <dd className="font-medium">{lot.weightKg} kg</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Value</dt>
                <dd className="font-medium text-primary">{inr(lotValue(lot))}</dd>
              </div>
            </dl>
            <ol className="mt-5 space-y-3">
              {traceSteps.map((s, i) => {
                const done = i < (statusStep[lot.status] ?? 0);
                return (
                  <li key={s} className="flex items-start gap-3 text-sm">
                    {done ? (
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                    ) : (
                      <Circle className="mt-0.5 size-5 shrink-0 text-muted-foreground/50" />
                    )}
                    <span>
                      <span className={done ? "font-medium" : "text-muted-foreground"}>{s}</span>
                      <span className="block text-xs text-muted-foreground">
                        {done ? `Verified · ${lot.city}` : "Pending"}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ol>
          </SectionCard>
        ) : (
          <SectionCard title="Chain of custody">
            <p className="text-sm text-muted-foreground">No lot matches that ID.</p>
          </SectionCard>
        )}
      </div>
    </div>
  );
}
