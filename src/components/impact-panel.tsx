import { Factory, Leaf, Recycle, Users, Wallet, Wind } from "lucide-react";
import { computeImpact, IMPACT_DISCLAIMER } from "@/lib/impact";
import { useData } from "@/lib/store";

export function ImpactPanel({ collectorId }: { collectorId?: string }) {
  const { lots, transactions } = useData();
  const scopedLots = collectorId ? lots.filter((l) => l.collectorId === collectorId) : lots;
  const scopedTxns = collectorId ? transactions.filter((t) => t.collectorId === collectorId) : transactions;
  const impact = computeImpact(scopedLots, scopedTxns);

  const items = [
    { label: "E-Waste Diverted", value: `${impact.divertedKg} kg`, icon: Recycle },
    { label: "Material Recovered", value: `${impact.recoveredKg} kg`, icon: Leaf },
    { label: "CO₂e Avoided", value: `${impact.co2Kg} kg`, icon: Wind },
    { label: "Formal Transactions", value: impact.formalTransactions, icon: Wallet },
    { label: "Collectors Connected", value: impact.collectorsConnected, icon: Users },
    { label: "Recyclers Connected", value: impact.recyclersConnected, icon: Factory },
  ];

  return (
    <section className="rounded-2xl border border-primary/25 bg-primary/5 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Leaf className="size-5 text-primary" />
        <h2 className="text-base font-semibold tracking-tight">Environmental Impact</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((i) => (
          <div key={i.label} className="rounded-xl bg-card p-3 text-center shadow-sm">
            <i.icon className="mx-auto size-5 text-primary" />
            <p className="mt-1.5 text-lg font-semibold tracking-tight">{i.value}</p>
            <p className="text-[11px] leading-tight text-muted-foreground">{i.label}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{IMPACT_DISCLAIMER}</p>
    </section>
  );
}
