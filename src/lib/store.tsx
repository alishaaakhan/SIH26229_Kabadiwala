import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  collectorById,
  lots as seedLots,
  notifications as seedNotifications,
  recyclerById,
  transactions as seedTransactions,
  type Lot,
  type LotStatus,
  type Notification,
  type SyncStatus,
  type Transaction,
} from "./demo-data";
import { derivedEvents, stagesForStatus, type LotEvent, type TimelineStage } from "./timeline";
import { materialByKey, type PriceOverrides } from "./materials";

const STORAGE_KEY = "kc.state.v1";

/** Complete SIH demo journey — Ramesh · PCB · 15 kg · Green Recycling · ₹335/kg */
export const demoJourneyLotId = "LOT-2001";

const demoJourneyLot: Lot = {
  id: demoJourneyLotId,
  material: "PCB",
  materialKey: "pcb",
  category: "E-Waste",
  weightKg: 15,
  ratePerKg: 335,
  collectorId: "C-101",
  recyclerId: "R-201",
  status: "paid",
  createdAt: "2026-09-02",
  pickupSlot: "2 Sep, 4:00 PM",
  city: "Indore",
  matchScore: 98,
  aiConfidence: 94,
  syncStatus: "synced",
};

const demoJourneyTxn: Transaction = {
  id: "TXN-9012",
  lotId: demoJourneyLotId,
  collectorId: "C-101",
  recyclerId: "R-201",
  amount: 5025,
  mode: "UPI",
  status: "completed",
  date: "2026-09-02",
};

const initialLots: Lot[] = [demoJourneyLot, ...seedLots.map((l) => ({ ...l, syncStatus: "synced" as SyncStatus }))];
const initialTransactions: Transaction[] = [demoJourneyTxn, ...seedTransactions];

interface PersistShape {
  lots: Lot[];
  transactions: Transaction[];
  notifications: Notification[];
  events: LotEvent[];
  prices: PriceOverrides;
  offline: boolean;
}

interface DataValue {
  lots: Lot[];
  transactions: Transaction[];
  notifications: Notification[];
  events: LotEvent[];
  prices: PriceOverrides;
  offline: boolean;
  pendingSyncCount: number;
  addLot: (
    lot: Omit<Lot, "id" | "createdAt" | "status" | "syncStatus"> & { status?: LotStatus },
  ) => Lot;
  setLotStatus: (id: string, status: LotStatus, patch?: Partial<Lot>) => void;
  acceptLot: (id: string, recyclerId: string, offerPerKg?: number) => void;
  settlePayment: (lotId: string) => void;
  markAllRead: () => void;
  toggleRead: (id: string) => void;
  eventsForLot: (lotId: string) => LotEvent[];
  logEvent: (lotId: string, stage: TimelineStage, actor: string, location?: string, note?: string) => void;
  setOffline: (v: boolean) => void;
  syncNow: () => void;
  updatePrice: (key: string, patch: { basePrice?: number; quality?: number; demand?: number }) => void;
  resetDemo: () => void;
}

const DataContext = createContext<DataValue | null>(null);

const nowStamp = () => {
  const d = new Date();
  return `${d.toISOString().slice(0, 10)} · ${d.toTimeString().slice(0, 5)}`;
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [lots, setLots] = useState<Lot[]>(initialLots);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [notifications, setNotifications] = useState<Notification[]>(seedNotifications);
  const [events, setEvents] = useState<LotEvent[]>([]);
  const [prices, setPrices] = useState<PriceOverrides>({});
  const [offline, setOfflineState] = useState(false);
  const hydrated = useRef(false);

  // Hydrate from localStorage after mount (keeps SSR output stable).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw) as Partial<PersistShape>;
        if (p.lots?.length) setLots(p.lots);
        if (p.transactions?.length) setTransactions(p.transactions);
        if (p.notifications?.length) setNotifications(p.notifications);
        if (p.events) setEvents(p.events);
        if (p.prices) setPrices(p.prices);
        if (typeof p.offline === "boolean") setOfflineState(p.offline);
      }
    } catch {
      /* ignore */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      const payload: PersistShape = { lots, transactions, notifications, events, prices, offline };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore */
    }
  }, [lots, transactions, notifications, events, prices, offline]);

  const pushNotification = useCallback((n: Omit<Notification, "id" | "time" | "read">) => {
    setNotifications((prev) => [
      { ...n, id: `N-${Date.now()}-${Math.round(Math.random() * 999)}`, time: "Just now", read: false },
      ...prev,
    ]);
  }, []);

  const appendEvents = useCallback((lot: Lot | undefined, newOnes: Omit<LotEvent, "id" | "lotId">[]) => {
    if (!lot) return;
    setEvents((prev) => {
      const has = prev.some((e) => e.lotId === lot.id);
      const base = has
        ? prev
        : [
            ...prev,
            ...derivedEvents(
              lot.id,
              lot.status,
              lot.createdAt,
              lot.city,
              collectorById(lot.collectorId)?.name ?? "Collector",
              lot.recyclerId ? recyclerById(lot.recyclerId)?.name : undefined,
            ),
          ];
      const existing = new Set(base.filter((e) => e.lotId === lot.id).map((e) => e.stage));
      const additions = newOnes
        .filter((e) => !existing.has(e.stage))
        .map((e, i) => ({ ...e, id: `${lot.id}-${e.stage}-${Date.now()}-${i}`, lotId: lot.id }));
      return [...base, ...additions];
    });
  }, []);

  const eventsForLot = useCallback(
    (lotId: string) => {
      const recorded = events.filter((e) => e.lotId === lotId);
      if (recorded.length) return recorded;
      const lot = lots.find((l) => l.id === lotId);
      if (!lot) return [];
      return derivedEvents(
        lot.id,
        lot.status,
        lot.createdAt,
        lot.city,
        collectorById(lot.collectorId)?.name ?? "Collector",
        lot.recyclerId ? recyclerById(lot.recyclerId)?.name : undefined,
      );
    },
    [events, lots],
  );

  const logEvent = useCallback<DataValue["logEvent"]>(
    (lotId, stage, actor, location, note) => {
      const lot = lots.find((l) => l.id === lotId);
      const ev: Omit<LotEvent, "id" | "lotId"> = { stage, at: nowStamp(), actor };
      if (location) ev.location = location;
      if (note) ev.note = note;
      appendEvents(lot, [ev]);
    },
    [lots, appendEvents],
  );

  const addLot: DataValue["addLot"] = useCallback(
    (input) => {
      const spec = input.materialKey ? materialByKey(input.materialKey) : undefined;
      const lot: Lot = {
        ...input,
        id: `LOT-${3000 + Math.floor(Math.random() * 900)}`,
        createdAt: new Date().toISOString().slice(0, 10),
        status: input.status ?? "listed",
        syncStatus: offline ? "pending" : "synced",
      };
      setLots((prev) => [lot, ...prev]);

      const actor = collectorById(lot.collectorId)?.name ?? "Collector";
      const base: Omit<LotEvent, "id" | "lotId">[] = [
        { stage: "lot_created", at: nowStamp(), actor, location: lot.city },
        {
          stage: "material_identified",
          at: nowStamp(),
          actor: spec ? "Kabadiwala Connect AI (prototype)" : actor,
          location: lot.city,
          note: lot.aiConfidence ? `${lot.material} · ${lot.aiConfidence}% confidence` : lot.material,
        },
        {
          stage: "price_estimated",
          at: nowStamp(),
          actor: "Price engine",
          note: `₹${lot.ratePerKg}/kg indicative`,
        },
      ];
      if (lot.recyclerId) {
        base.push({
          stage: "recycler_matched",
          at: nowStamp(),
          actor: "Smart matching",
          note: `${recyclerById(lot.recyclerId)?.name}${lot.matchScore ? ` · ${lot.matchScore}% match` : ""}`,
        });
      }
      appendEvents(lot, base);

      pushNotification({
        title: offline ? "Lot saved offline" : "Lot published",
        body: offline
          ? `${lot.material} (${lot.weightKg} kg) is saved on this phone and marked Pending Sync.`
          : `${lot.material} (${lot.weightKg} kg) is now visible to nearby recyclers.`,
        type: offline ? "system" : "offer",
      });
      return lot;
    },
    [pushNotification, appendEvents, offline],
  );

  const setLotStatus: DataValue["setLotStatus"] = useCallback(
    (id, status, patch) => {
      let updated: Lot | undefined;
      setLots((prev) =>
        prev.map((l) => {
          if (l.id !== id) return l;
          updated = { ...l, ...patch, status };
          return updated;
        }),
      );
      const lot = lots.find((l) => l.id === id);
      const merged = updated ?? (lot ? { ...lot, ...patch, status } : undefined);
      if (merged) {
        const recycler = merged.recyclerId ? recyclerById(merged.recyclerId)?.name : undefined;
        const collector = collectorById(merged.collectorId)?.name ?? "Collector";
        const stages = stagesForStatus[status];
        appendEvents(
          merged,
          stages.map((stage) => ({
            stage,
            at: nowStamp(),
            actor: ["pickup_scheduled", "facility_received", "handover_verified", "processing_started", "recycled"].includes(stage)
              ? (recycler ?? "Recycler")
              : collector,
            location: merged.city,
          })),
        );
      }

      const titles: Partial<Record<LotStatus, string>> = {
        pickup_scheduled: "Pickup scheduled",
        in_transit: "Pickup completed",
        delivered: "Handover verified",
        paid: "Payment successful",
      };
      pushNotification({
        title: titles[status] ?? "Lot updated",
        body: `${id} moved to ${status.replace(/_/g, " ")}.`,
        type: status === "paid" ? "payment" : "pickup",
      });
      if (status === "pickup_scheduled") {
        pushNotification({
          title: "Pickup agent assigned",
          body: `Agent Vinod (MP-09-DK-4412) will collect ${id}.`,
          type: "pickup",
        });
      }
    },
    [pushNotification, appendEvents, lots],
  );

  const acceptLot: DataValue["acceptLot"] = useCallback(
    (id, recyclerId, offerPerKg) => {
      const lot = lots.find((l) => l.id === id);
      setLots((prev) =>
        prev.map((l) =>
          l.id === id
            ? { ...l, recyclerId, status: "matched", ...(offerPerKg ? { ratePerKg: offerPerKg } : {}) }
            : l,
        ),
      );
      const rName = recyclerById(recyclerId)?.name ?? "Recycler";
      if (lot) {
        appendEvents({ ...lot, recyclerId }, [
          { stage: "recycler_matched", at: nowStamp(), actor: "Smart matching", note: rName },
          {
            stage: "offer_received",
            at: nowStamp(),
            actor: rName,
            note: `₹${offerPerKg ?? lot.ratePerKg}/kg`,
          },
          { stage: "offer_accepted", at: nowStamp(), actor: collectorById(lot.collectorId)?.name ?? "Collector" },
        ]);
      }
      pushNotification({
        title: "Offer accepted",
        body: `${id} matched with ${rName}${offerPerKg ? ` at ₹${offerPerKg}/kg` : ""}.`,
        type: "offer",
      });
    },
    [pushNotification, appendEvents, lots],
  );

  const settlePayment: DataValue["settlePayment"] = useCallback(
    (lotId) => {
      const lot = lots.find((l) => l.id === lotId);
      setLots((prev) => prev.map((l) => (l.id === lotId ? { ...l, status: "paid" } : l)));
      setTransactions((prev) => {
        const exists = prev.some((t) => t.lotId === lotId);
        if (exists) return prev.map((t) => (t.lotId === lotId ? { ...t, status: "completed" } : t));
        if (!lot) return prev;
        return [
          {
            id: `TXN-${9100 + Math.floor(Math.random() * 800)}`,
            lotId,
            collectorId: lot.collectorId,
            recyclerId: lot.recyclerId ?? "R-201",
            amount: Math.round(lot.weightKg * lot.ratePerKg),
            mode: "UPI",
            status: "completed",
            date: new Date().toISOString().slice(0, 10),
          },
          ...prev,
        ];
      });
      if (lot) {
        const rName = lot.recyclerId ? recyclerById(lot.recyclerId)?.name : "Recycler";
        appendEvents({ ...lot, status: "paid" }, [
          { stage: "payment_completed", at: nowStamp(), actor: rName ?? "Recycler", note: "UPI settlement" },
          { stage: "processing_started", at: nowStamp(), actor: rName ?? "Recycler", location: lot.city },
          {
            stage: "recycled",
            at: nowStamp(),
            actor: rName ?? "Recycler",
            note: "Formal recycling certificate issued",
          },
        ]);
      }
      pushNotification({
        title: "Payment successful",
        body: `Payment for ${lotId} has been settled digitally.`,
        type: "payment",
      });
    },
    [pushNotification, appendEvents, lots],
  );

  const setOffline = useCallback(
    (v: boolean) => {
      setOfflineState(v);
      pushNotification({
        title: v ? "Offline mode on" : "Back online",
        body: v
          ? "New lots will be saved on this phone and synced later."
          : "Connection restored. Pending lots can be synced now.",
        type: "system",
      });
    },
    [pushNotification],
  );

  const syncNow = useCallback(() => {
    if (offline) {
      setLots((prev) => prev.map((l) => (l.syncStatus === "pending" ? { ...l, syncStatus: "failed" } : l)));
      pushNotification({
        title: "Sync failed",
        body: "No connection. Turn off offline mode and try Sync Now again.",
        type: "system",
      });
      return;
    }
    let count = 0;
    setLots((prev) =>
      prev.map((l) => {
        if (l.syncStatus === "pending" || l.syncStatus === "failed") {
          count += 1;
          return { ...l, syncStatus: "synced" };
        }
        return l;
      }),
    );
    pushNotification({
      title: "Sync completed",
      body: count ? `${count} offline lot(s) synced to the platform.` : "Everything is already up to date.",
      type: "system",
    });
  }, [offline, pushNotification]);

  const updatePrice = useCallback<DataValue["updatePrice"]>(
    (key, patch) => {
      setPrices((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
      pushNotification({
        title: "Price updated",
        body: `Indicative rate for ${materialByKey(key)?.label ?? key} was revised by the monitoring cell.`,
        type: "system",
      });
    },
    [pushNotification],
  );

  const resetDemo = useCallback(() => {
    setLots(initialLots);
    setTransactions(initialTransactions);
    setNotifications(seedNotifications);
    setEvents([]);
    setPrices({});
    setOfflineState(false);
  }, []);

  const pendingSyncCount = lots.filter((l) => l.syncStatus === "pending" || l.syncStatus === "failed").length;

  const value = useMemo<DataValue>(
    () => ({
      lots,
      transactions,
      notifications,
      events,
      prices,
      offline,
      pendingSyncCount,
      addLot,
      setLotStatus,
      acceptLot,
      settlePayment,
      markAllRead: () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))),
      toggleRead: (id) =>
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))),
      eventsForLot,
      logEvent,
      setOffline,
      syncNow,
      updatePrice,
      resetDemo,
    }),
    [
      lots,
      transactions,
      notifications,
      events,
      prices,
      offline,
      pendingSyncCount,
      addLot,
      setLotStatus,
      acceptLot,
      settlePayment,
      eventsForLot,
      logEvent,
      setOffline,
      syncNow,
      updatePrice,
      resetDemo,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
}
