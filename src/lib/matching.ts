import { recyclers, type Recycler } from "./demo-data";
import { indicativePrice, type MaterialSpec, type PriceOverrides } from "./materials";

export interface MatchReason {
  ok: boolean;
  text: string;
}

export interface RecyclerMatch {
  recycler: Recycler;
  score: number;
  offerPerKg: number;
  pickupEta: string;
  capacityFree: number;
  reasons: MatchReason[];
}

const pickupSlots = ["Today, 4:00 PM", "Today, 7:00 PM", "Tomorrow, 9:00 AM", "Tomorrow, 2:00 PM"];

/**
 * Match score 0–100 built from material compatibility, distance, verification,
 * rating, pickup availability, capacity and offer price.
 */
export function matchRecyclers(
  spec: MaterialSpec,
  weightKg: number,
  overrides?: PriceOverrides,
): RecyclerMatch[] {
  const base = indicativePrice(spec, overrides);

  return recyclers
    .map((r, idx) => {
      const accepts = r.materials.includes(spec.category);
      const distanceScore = Math.max(0, 20 - r.distanceKm * 1.4);
      const ratingScore = (r.rating / 5) * 15;
      const verifiedScore = r.verified ? 15 : 4;
      const materialScore = accepts ? 30 : 6;
      const capacityFree = Math.round(r.capacityTpd * 1000 * 0.35);
      const capacityScore = capacityFree > weightKg ? 10 : 3;
      const pickupAvailable = r.distanceKm < 10;
      const pickupScore = pickupAvailable ? 10 : 3;

      const premium = (accepts ? 1.03 : 0.9) * (r.verified ? 1.02 : 0.94) * (1 + (r.rating - 4.3) / 40);
      const offerPerKg = Math.round(base * premium);
      const priceScore = Math.min(10, Math.max(0, ((offerPerKg - base * 0.9) / (base * 0.2)) * 10));

      const score = Math.min(
        99,
        Math.round(
          materialScore + distanceScore + verifiedScore + ratingScore + capacityScore + pickupScore + priceScore * 0.1,
        ),
      );

      return {
        recycler: r,
        score,
        offerPerKg,
        pickupEta: pickupSlots[idx % pickupSlots.length]!,
        capacityFree,
        reasons: [
          { ok: accepts, text: accepts ? `${spec.category} accepted` : `${spec.category} not usually accepted` },
          { ok: r.verified, text: r.verified ? "Verified recycler" : "Verification pending" },
          { ok: pickupAvailable, text: pickupAvailable ? "Pickup available" : "Pickup on request" },
          { ok: r.distanceKm < 12, text: `${r.distanceKm} km away` },
          { ok: capacityFree > weightKg, text: `Capacity available (${r.capacityTpd} TPD)` },
        ],
      } satisfies RecyclerMatch;
    })
    .sort((a, b) => b.score - a.score);
}
