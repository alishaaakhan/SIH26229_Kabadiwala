import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, StatusPill } from "@/components/ui-bits";
import { useData } from "@/lib/store";
import { collectorById, inr, lotValue, recyclerById, statusLabel } from "@/lib/demo-data";

export const Route = createFileRoute("/admin/lots")({
  component: AdminLots,
});

const statuses = ["All", ...Object.keys(statusLabel)] as const;

function AdminLots() {
  const { lots } = useData();
  const [status, setStatus] = useState<string>("All");
  const rows = lots.filter((l) => status === "All" || l.status === status);

  return (
    <div className="space-y-4">
      <PageHeader title="Lots" subtitle="Every digital lot created across the network." />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium " +
              (status === s ? "bg-primary text-primary-foreground" : "bg-secondary")
            }
          >
            {s === "All" ? "All" : statusLabel[s as keyof typeof statusLabel]}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="bg-secondary/60 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Lot</th>
              <th className="px-4 py-3">Material</th>
              <th className="px-4 py-3">Collector</th>
              <th className="px-4 py-3">Recycler</th>
              <th className="px-4 py-3">Weight</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((l) => (
              <tr key={l.id}>
                <td className="px-4 py-3 font-medium">{l.id}</td>
                <td className="px-4 py-3">{l.material}</td>
                <td className="px-4 py-3">{collectorById(l.collectorId)?.name}</td>
                <td className="px-4 py-3">
                  {l.recyclerId ? recyclerById(l.recyclerId)?.name : "—"}
                </td>
                <td className="px-4 py-3">{l.weightKg} kg</td>
                <td className="px-4 py-3">{inr(lotValue(l))}</td>
                <td className="px-4 py-3">{l.city}</td>
                <td className="px-4 py-3">
                  <StatusPill status={l.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
