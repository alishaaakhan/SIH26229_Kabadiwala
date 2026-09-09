import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import { PageHeader } from "@/components/ui-bits";
import { collectors, inr } from "@/lib/demo-data";

export const Route = createFileRoute("/admin/collectors")({
  component: AdminCollectors,
});

function AdminCollectors() {
  const [q, setQ] = useState("");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const rows = collectors.filter(
    (c) =>
      (!onlyVerified || c.verified) &&
      (c.name.toLowerCase().includes(q.toLowerCase()) ||
        c.city.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="space-y-4">
      <PageHeader title="Collectors" subtitle="Registry of informal collectors on the platform." />
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or city"
          className="w-full rounded-xl border border-border bg-card px-4 py-3.5 text-base"
        />
        <button
          onClick={() => setOnlyVerified((v) => !v)}
          className={
            "shrink-0 rounded-xl px-4 py-3.5 text-sm font-semibold " +
            (onlyVerified ? "bg-primary text-primary-foreground" : "bg-secondary")
          }
        >
          Verified only
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-secondary/60 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Material</th>
              <th className="px-4 py-3">Earnings</th>
              <th className="px-4 py-3">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-medium">{c.id}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    {c.name}
                    {c.verified ? <BadgeCheck className="size-4 text-primary" /> : null}
                  </span>
                </td>
                <td className="px-4 py-3">{c.city}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      "rounded-full px-2.5 py-1 text-xs font-medium " +
                      (c.active ? "bg-success/15 text-success" : "bg-secondary")
                    }
                  >
                    {c.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">{c.totalKg} kg</td>
                <td className="px-4 py-3">{inr(c.totalEarned)}</td>
                <td className="px-4 py-3">{c.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
