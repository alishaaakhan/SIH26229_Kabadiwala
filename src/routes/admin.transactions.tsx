import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { IndianRupee, Receipt } from "lucide-react";
import { PageHeader, StatCard, TxnPill } from "@/components/ui-bits";
import { useData } from "@/lib/store";
import { collectorById, inr, recyclerById } from "@/lib/demo-data";

export const Route = createFileRoute("/admin/transactions")({
  component: AdminTransactions,
});

const tabs = ["All", "completed", "pending", "processing"] as const;

function AdminTransactions() {
  const { transactions } = useData();
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const rows = transactions.filter((t) => tab === "All" || t.status === tab);
  const total = transactions.reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-4">
      <PageHeader title="Transactions" subtitle="Audit trail of every digital settlement." />
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total value tracked" value={inr(total)} icon={IndianRupee} tone="primary" />
        <StatCard label="Records" value={transactions.length} icon={Receipt} />
      </div>
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
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[780px] text-sm">
          <thead className="bg-secondary/60 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Txn</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Collector</th>
              <th className="px-4 py-3">Recycler</th>
              <th className="px-4 py-3">Lot</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((t) => (
              <tr key={t.id}>
                <td className="px-4 py-3 font-medium">{t.id}</td>
                <td className="px-4 py-3">{t.date}</td>
                <td className="px-4 py-3">{collectorById(t.collectorId)?.name}</td>
                <td className="px-4 py-3">{recyclerById(t.recyclerId)?.name}</td>
                <td className="px-4 py-3">{t.lotId}</td>
                <td className="px-4 py-3">{inr(t.amount)}</td>
                <td className="px-4 py-3">
                  <TxnPill status={t.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
