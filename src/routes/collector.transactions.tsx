import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, TxnPill } from "@/components/ui-bits";
import { useData } from "@/lib/store";
import { inr, recyclerById } from "@/lib/demo-data";

export const Route = createFileRoute("/collector/transactions")({
  component: Transactions,
});

const tabs = ["All", "completed", "pending", "processing"] as const;

function Transactions() {
  const { transactions } = useData();
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const rows = transactions
    .filter((t) => t.collectorId === "C-101")
    .filter((t) => tab === "All" || t.status === tab);

  return (
    <div className="space-y-4">
      <PageHeader title="Transactions" subtitle="Every digital handover has a permanent record." />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium capitalize " +
              (tab === t ? "bg-primary text-primary-foreground" : "bg-secondary")
            }
          >
            {t}
          </button>
        ))}
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {rows.map((t) => (
          <div key={t.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{inr(t.amount)}</p>
                <p className="text-xs text-muted-foreground">
                  {t.id} · {t.lotId} · {t.date}
                </p>
              </div>
              <TxnPill status={t.status} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {recyclerById(t.recyclerId)?.name} · Paid via {t.mode}
            </p>
          </div>
        ))}
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No transactions in this filter.</p>
        ) : null}
      </div>
    </div>
  );
}
