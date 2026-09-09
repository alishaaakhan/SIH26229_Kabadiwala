import type { LotStatus } from "./demo-data";

export const timelineStages = [
  "lot_created",
  "material_identified",
  "price_estimated",
  "recycler_matched",
  "offer_received",
  "offer_accepted",
  "pickup_scheduled",
  "pickup_completed",
  "facility_received",
  "handover_verified",
  "payment_completed",
  "processing_started",
  "recycled",
] as const;

export type TimelineStage = (typeof timelineStages)[number];

export const stageLabel: Record<TimelineStage, string> = {
  lot_created: "Lot Created",
  material_identified: "Material Identified",
  price_estimated: "Price Estimated",
  recycler_matched: "Recycler Matched",
  offer_received: "Offer Received",
  offer_accepted: "Offer Accepted",
  pickup_scheduled: "Pickup Scheduled",
  pickup_completed: "Pickup Completed",
  facility_received: "Facility Received",
  handover_verified: "Handover Verified",
  payment_completed: "Payment Completed",
  processing_started: "Processing Started",
  recycled: "Recycled",
};

export interface LotEvent {
  id: string;
  lotId: string;
  stage: TimelineStage;
  at: string;
  actor: string;
  location?: string;
  note?: string;
}

/** How far along the 13-stage timeline a lot status implies. */
export const stagesForStatus: Record<LotStatus, TimelineStage[]> = {
  listed: ["lot_created", "material_identified", "price_estimated", "recycler_matched"],
  matched: [
    "lot_created",
    "material_identified",
    "price_estimated",
    "recycler_matched",
    "offer_received",
    "offer_accepted",
  ],
  pickup_scheduled: [
    "lot_created",
    "material_identified",
    "price_estimated",
    "recycler_matched",
    "offer_received",
    "offer_accepted",
    "pickup_scheduled",
  ],
  in_transit: [
    "lot_created",
    "material_identified",
    "price_estimated",
    "recycler_matched",
    "offer_received",
    "offer_accepted",
    "pickup_scheduled",
    "pickup_completed",
  ],
  delivered: [
    "lot_created",
    "material_identified",
    "price_estimated",
    "recycler_matched",
    "offer_received",
    "offer_accepted",
    "pickup_scheduled",
    "pickup_completed",
    "facility_received",
    "handover_verified",
  ],
  paid: [...timelineStages],
  cancelled: ["lot_created", "material_identified", "price_estimated"],
};

export const stageIndex = (s: TimelineStage) => timelineStages.indexOf(s);

/** Build a plausible event log for a seeded lot that has no recorded events. */
export function derivedEvents(
  lotId: string,
  status: LotStatus,
  createdAt: string,
  city: string,
  collectorName: string,
  recyclerName?: string,
): LotEvent[] {
  const stages = stagesForStatus[status];
  const collectorStages: TimelineStage[] = [
    "lot_created",
    "material_identified",
    "price_estimated",
    "offer_accepted",
    "pickup_completed",
  ];
  return stages.map((stage, i) => {
    const ev: LotEvent = {
      id: `${lotId}-${stage}`,
      lotId,
      stage,
      at: `${createdAt} · ${String(9 + i).padStart(2, "0")}:${((i * 17) % 60).toString().padStart(2, "0")}`,
      actor: collectorStages.includes(stage) ? collectorName : (recyclerName ?? "Kabadiwala Connect"),
      location: i < 8 ? city : recyclerName ? `${recyclerName}, ${city}` : city,
    };
    if (stage === "recycled") ev.note = "Formal recycling certificate issued";
    return ev;
  });
}
