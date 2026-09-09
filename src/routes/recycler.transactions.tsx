import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, StatCard, TxnPill } from "@/components/ui-bits";
import { useData } from "@/lib/store";
import { collectorById, inr } from "@/lib/demo-data";
import { IndianRupee, Receipt } from "lucide-react";

export const Route = createFileRoute("/recycler/transactions")({
  component: RecyclerTransactions,
});

const tabs = ["All", "completed", "pending", "processing"] as const;

function RecyclerTransactions() {
  const { transactions, settlePayment } = useData();
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const all = transactions;
  const rows = all.filter((t) => tab === "All" || t.status === tab);
  const paidOut = all.filter((t) => t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const due = all.filter((t) => t.status !== "completed").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-4">
      <PageHeader title="Transactions" subtitle="Procurement ledger with settlement status." />
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Settled" value={inr(paidOut)} icon={Receipt} tone="primary" />
        <StatCard label="Outstanding" value={inr(due)} icon={IndianRupee} tone="warning" />
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
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-secondary/60 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Txn</th>
              <th className="px-4 py-3">Collector</th>
              <th className="px-4 py-3">Lot</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Mode</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((t) => (
              <tr key={t.id}>
                <td className="px-4 py-3 font-medium">{t.id}</td>
                <td className="px-4 py-3">{collectorById(t.collectorId)?.name}</td>
                <td className="px-4 py-3">{t.lotId}</td>
                <td className="px-4 py-3 font-medium">{inr(t.amount)}</td>
                <td className="px-4 py-3">{t.mode}</td>
                <td className="px-4 py-3">
                  <TxnPill status={t.status} />
                </td>
                <td className="px-4 py-3">
                  {t.status !== "completed" ? (
                    <button
                      onClick={() => settlePayment(t.lotId)}
                      className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                    >
                      Settle
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
