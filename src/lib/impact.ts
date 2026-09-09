import type { Lot, Transaction } from "./demo-data";
import { materialByKey, materialByLabel } from "./materials";

export const IMPACT_DISCLAIMER = "Estimated prototype impact — not measured real-world data.";

export interface ImpactSummary {
  divertedKg: number;
  recoveredKg: number;
  co2Kg: number;
  formalTransactions: number;
  collectorsConnected: number;
  recyclersConnected: number;
}

const recoveryFor = (lot: Lot) => {
  const spec = (lot.materialKey ? materialByKey(lot.materialKey) : undefined) ?? materialByLabel(lot.material);
  if (spec) return spec.recovery;
  return lot.category === "E-Waste" ? 0.5 : lot.category === "Metal" ? 0.8 : 0.55;
};

/** Impact estimated from completed (paid/delivered) demo lots and transactions. */
export function computeImpact(lots: Lot[], transactions: Transaction[]): ImpactSummary {
  const done = lots.filter((l) => ["delivered", "paid"].includes(l.status));
  const divertedKg = done.reduce((s, l) => s + l.weightKg, 0);
  const recoveredKg = done.reduce((s, l) => s + l.weightKg * recoveryFor(l), 0);
  const completed = transactions.filter((t) => t.status === "completed");
  return {
    divertedKg: Math.round(divertedKg * 10) / 10,
    recoveredKg: Math.round(recoveredKg * 10) / 10,
    co2Kg: Math.round(divertedKg * 1.4 * 10) / 10,
    formalTransactions: completed.length,
    collectorsConnected: new Set(done.map((l) => l.collectorId)).size,
    recyclersConnected: new Set(done.map((l) => l.recyclerId).filter(Boolean)).size,
  };
}
