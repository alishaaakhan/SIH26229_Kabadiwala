export type Role = "collector" | "recycler" | "admin";

export type LotStatus =
  | "listed"
  | "matched"
  | "pickup_scheduled"
  | "in_transit"
  | "delivered"
  | "paid"
  | "cancelled";

export type SyncStatus = "synced" | "pending" | "failed";

export interface Lot {
  id: string;
  material: string;
  category: "E-Waste" | "Metal" | "Plastic" | "Paper" | "Glass";
  weightKg: number;
  ratePerKg: number;
  collectorId: string;
  recyclerId?: string;
  status: LotStatus;
  createdAt: string;
  pickupSlot?: string;
  city: string;
  /** Key from the material catalogue, when the lot came through the AI flow */
  materialKey?: string;
  /** Recycler match score 0–100 from smart matching */
  matchScore?: number;
  /** Confidence of the demo AI detection, when used */
  aiConfidence?: number;
  syncStatus?: SyncStatus;
}

export interface Transaction {
  id: string;
  lotId: string;
  collectorId: string;
  recyclerId: string;
  amount: number;
  mode: "UPI" | "Bank Transfer" | "Cash";
  status: "completed" | "pending" | "processing";
  date: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  type: "offer" | "pickup" | "payment" | "system" | "safety";
  read: boolean;
}

export interface Collector {
  id: string;
  name: string;
  mobile: string;
  city: string;
  verified: boolean;
  active: boolean;
  rating: number;
  totalKg: number;
  totalEarned: number;
}

export interface Recycler {
  id: string;
  name: string;
  mobile: string;
  city: string;
  verified: boolean;
  materials: string[];
  capacityTpd: number;
  rating: number;
  distanceKm: number;
}

export const collectors: Collector[] = [
  {
    id: "C-101",
    name: "Ramesh Kumar",
    mobile: "9999999999",
    city: "Indore",
    verified: true,
    active: true,
    rating: 4.7,
    totalKg: 1840,
    totalEarned: 25450,
  },
  {
    id: "C-102",
    name: "Suresh Patil",
    mobile: "9812345671",
    city: "Pune",
    verified: true,
    active: true,
    rating: 4.4,
    totalKg: 1320,
    totalEarned: 19870,
  },
  {
    id: "C-103",
    name: "Anita Sharma",
    mobile: "9812345672",
    city: "Jaipur",
    verified: true,
    active: false,
    rating: 4.8,
    totalKg: 2110,
    totalEarned: 31240,
  },
  {
    id: "C-104",
    name: "Mohit Verma",
    mobile: "9812345673",
    city: "Lucknow",
    verified: false,
    active: true,
    rating: 4.1,
    totalKg: 640,
    totalEarned: 8930,
  },
];

export const recyclers: Recycler[] = [
  {
    id: "R-201",
    name: "Green Recycling Facility",
    mobile: "8888888888",
    city: "Indore",
    verified: true,
    materials: ["E-Waste", "Metal"],
    capacityTpd: 24,
    rating: 4.6,
    distanceKm: 3.2,
  },
  {
    id: "R-202",
    name: "Eco Recycle Center",
    mobile: "8812345671",
    city: "Pune",
    verified: true,
    materials: ["Plastic", "Paper"],
    capacityTpd: 18,
    rating: 4.3,
    distanceKm: 5.8,
  },
  {
    id: "R-203",
    name: "Circular Recovery Hub",
    mobile: "8812345672",
    city: "Jaipur",
    verified: true,
    materials: ["E-Waste", "Glass", "Metal"],
    capacityTpd: 31,
    rating: 4.8,
    distanceKm: 8.4,
  },
  {
    id: "R-204",
    name: "Safe E-Waste Solutions",
    mobile: "8812345673",
    city: "Lucknow",
    verified: false,
    materials: ["E-Waste"],
    capacityTpd: 12,
    rating: 4.0,
    distanceKm: 11.6,
  },
];

export const lots: Lot[] = [
  {
    id: "LOT-1001",
    material: "Mixed Circuit Boards",
    category: "E-Waste",
    weightKg: 42,
    ratePerKg: 185,
    collectorId: "C-101",
    recyclerId: "R-201",
    status: "pickup_scheduled",
    createdAt: "2026-08-30",
    pickupSlot: "Today, 4:00 PM",
    city: "Indore",
  },
  {
    id: "LOT-1002",
    material: "Old Laptops & Chargers",
    category: "E-Waste",
    weightKg: 28,
    ratePerKg: 140,
    collectorId: "C-101",
    status: "listed",
    createdAt: "2026-08-31",
    city: "Indore",
  },
  {
    id: "LOT-1003",
    material: "Copper Wire Scrap",
    category: "Metal",
    weightKg: 65,
    ratePerKg: 520,
    collectorId: "C-101",
    recyclerId: "R-203",
    status: "in_transit",
    createdAt: "2026-08-29",
    pickupSlot: "Yesterday, 11:00 AM",
    city: "Indore",
  },
  {
    id: "LOT-1004",
    material: "PET Bottles Bale",
    category: "Plastic",
    weightKg: 120,
    ratePerKg: 24,
    collectorId: "C-102",
    recyclerId: "R-202",
    status: "delivered",
    createdAt: "2026-08-27",
    pickupSlot: "27 Aug, 2:00 PM",
    city: "Pune",
  },
  {
    id: "LOT-1005",
    material: "Newspaper & Cardboard",
    category: "Paper",
    weightKg: 210,
    ratePerKg: 12,
    collectorId: "C-102",
    status: "listed",
    createdAt: "2026-08-31",
    city: "Pune",
  },
  {
    id: "LOT-1006",
    material: "CRT Monitors",
    category: "E-Waste",
    weightKg: 88,
    ratePerKg: 32,
    collectorId: "C-103",
    recyclerId: "R-203",
    status: "paid",
    createdAt: "2026-08-24",
    pickupSlot: "24 Aug, 10:30 AM",
    city: "Jaipur",
  },
  {
    id: "LOT-1007",
    material: "Aluminium Utensils",
    category: "Metal",
    weightKg: 54,
    ratePerKg: 165,
    collectorId: "C-103",
    recyclerId: "R-203",
    status: "matched",
    createdAt: "2026-08-30",
    city: "Jaipur",
  },
  {
    id: "LOT-1008",
    material: "Broken Glass Bottles",
    category: "Glass",
    weightKg: 96,
    ratePerKg: 8,
    collectorId: "C-104",
    status: "cancelled",
    createdAt: "2026-08-22",
    city: "Lucknow",
  },
  {
    id: "LOT-1009",
    material: "Mobile Phone Batteries",
    category: "E-Waste",
    weightKg: 17,
    ratePerKg: 210,
    collectorId: "C-104",
    recyclerId: "R-204",
    status: "pickup_scheduled",
    createdAt: "2026-08-31",
    pickupSlot: "Tomorrow, 9:00 AM",
    city: "Lucknow",
  },
  {
    id: "LOT-1010",
    material: "Iron Rods & Sheets",
    category: "Metal",
    weightKg: 340,
    ratePerKg: 38,
    collectorId: "C-102",
    recyclerId: "R-202",
    status: "paid",
    createdAt: "2026-08-20",
    pickupSlot: "20 Aug, 5:00 PM",
    city: "Pune",
  },
  {
    id: "LOT-1011",
    material: "Printer & Toner Waste",
    category: "E-Waste",
    weightKg: 36,
    ratePerKg: 95,
    collectorId: "C-101",
    status: "listed",
    createdAt: "2026-09-01",
    city: "Indore",
  },
  {
    id: "LOT-1012",
    material: "Mixed Plastic Scrap",
    category: "Plastic",
    weightKg: 145,
    ratePerKg: 18,
    collectorId: "C-103",
    recyclerId: "R-202",
    status: "delivered",
    createdAt: "2026-08-28",
    pickupSlot: "28 Aug, 1:00 PM",
    city: "Jaipur",
  },
];

export const transactions: Transaction[] = [
  {
    id: "TXN-9001",
    lotId: "LOT-1006",
    collectorId: "C-103",
    recyclerId: "R-203",
    amount: 2816,
    mode: "UPI",
    status: "completed",
    date: "2026-08-24",
  },
  {
    id: "TXN-9002",
    lotId: "LOT-1010",
    collectorId: "C-102",
    recyclerId: "R-202",
    amount: 12920,
    mode: "Bank Transfer",
    status: "completed",
    date: "2026-08-20",
  },
  {
    id: "TXN-9003",
    lotId: "LOT-1004",
    collectorId: "C-102",
    recyclerId: "R-202",
    amount: 2880,
    mode: "UPI",
    status: "pending",
    date: "2026-08-27",
  },
  {
    id: "TXN-9004",
    lotId: "LOT-1003",
    collectorId: "C-101",
    recyclerId: "R-203",
    amount: 33800,
    mode: "Bank Transfer",
    status: "processing",
    date: "2026-08-29",
  },
  {
    id: "TXN-9005",
    lotId: "LOT-1001",
    collectorId: "C-101",
    recyclerId: "R-201",
    amount: 7770,
    mode: "UPI",
    status: "pending",
    date: "2026-08-30",
  },
  {
    id: "TXN-9006",
    lotId: "LOT-1012",
    collectorId: "C-103",
    recyclerId: "R-202",
    amount: 2610,
    mode: "UPI",
    status: "completed",
    date: "2026-08-28",
  },
  {
    id: "TXN-9007",
    lotId: "LOT-1009",
    collectorId: "C-104",
    recyclerId: "R-204",
    amount: 3570,
    mode: "Cash",
    status: "pending",
    date: "2026-08-31",
  },
  {
    id: "TXN-9008",
    lotId: "LOT-1007",
    collectorId: "C-103",
    recyclerId: "R-203",
    amount: 8910,
    mode: "UPI",
    status: "processing",
    date: "2026-08-30",
  },
  {
    id: "TXN-9009",
    lotId: "LOT-1002",
    collectorId: "C-101",
    recyclerId: "R-201",
    amount: 850,
    mode: "UPI",
    status: "completed",
    date: "2026-09-01",
  },
  {
    id: "TXN-9010",
    lotId: "LOT-1005",
    collectorId: "C-102",
    recyclerId: "R-202",
    amount: 2520,
    mode: "Bank Transfer",
    status: "completed",
    date: "2026-08-26",
  },
  {
    id: "TXN-9011",
    lotId: "LOT-1011",
    collectorId: "C-101",
    recyclerId: "R-201",
    amount: 3420,
    mode: "UPI",
    status: "pending",
    date: "2026-09-01",
  },
];

export const notifications: Notification[] = [
  {
    id: "N-1",
    title: "New offer received",
    body: "Green Recycling Facility offered ₹185/kg for LOT-1001.",
    time: "5 min ago",
    type: "offer",
    read: false,
  },
  {
    id: "N-2",
    title: "Pickup scheduled",
    body: "Pickup for LOT-1001 confirmed today at 4:00 PM.",
    time: "22 min ago",
    type: "pickup",
    read: false,
  },
  {
    id: "N-3",
    title: "Payment credited",
    body: "₹850 credited to your UPI for LOT-1002.",
    time: "1 hr ago",
    type: "payment",
    read: false,
  },
  {
    id: "N-4",
    title: "Price update",
    body: "Copper scrap rate increased to ₹520/kg in Indore.",
    time: "3 hrs ago",
    type: "system",
    read: true,
  },
  {
    id: "N-5",
    title: "Safety reminder",
    body: "Always wear gloves while handling CRT and battery waste.",
    time: "5 hrs ago",
    type: "safety",
    read: true,
  },
  {
    id: "N-6",
    title: "Lot in transit",
    body: "LOT-1003 is on the way to Circular Recovery Hub.",
    time: "Yesterday",
    type: "pickup",
    read: true,
  },
  {
    id: "N-7",
    title: "Verification approved",
    body: "Your collector ID has been verified by the Municipal Board.",
    time: "2 days ago",
    type: "system",
    read: true,
  },
  {
    id: "N-8",
    title: "Payment pending",
    body: "₹1,250 pending release from Green Recycling Facility.",
    time: "2 days ago",
    type: "payment",
    read: true,
  },
  {
    id: "N-9",
    title: "New recycler nearby",
    body: "Safe E-Waste Solutions is now accepting lots within 12 km.",
    time: "3 days ago",
    type: "system",
    read: true,
  },
  {
    id: "N-10",
    title: "Training session",
    body: "Free safe-handling training this Sunday at Ward 12 office.",
    time: "4 days ago",
    type: "safety",
    read: true,
  },
];

export const marketPrices = [
  { material: "Copper Wire", category: "Metal", rate: 520, change: 4.2, unit: "kg" },
  { material: "Circuit Boards", category: "E-Waste", rate: 185, change: 2.1, unit: "kg" },
  { material: "Aluminium", category: "Metal", rate: 165, change: -1.3, unit: "kg" },
  { material: "Laptop Scrap", category: "E-Waste", rate: 140, change: 0.8, unit: "kg" },
  { material: "Phone Batteries", category: "E-Waste", rate: 210, change: 5.6, unit: "kg" },
  { material: "Iron", category: "Metal", rate: 38, change: -0.5, unit: "kg" },
  { material: "PET Bottles", category: "Plastic", rate: 24, change: 1.9, unit: "kg" },
  { material: "Mixed Plastic", category: "Plastic", rate: 18, change: 0.4, unit: "kg" },
  { material: "Newspaper", category: "Paper", rate: 12, change: -0.9, unit: "kg" },
  { material: "Glass Bottles", category: "Glass", rate: 8, change: 0.2, unit: "kg" },
];

export const monthlyCollection = [
  { month: "Mar", kg: 12400, lots: 210 },
  { month: "Apr", kg: 15200, lots: 248 },
  { month: "May", kg: 14100, lots: 231 },
  { month: "Jun", kg: 18600, lots: 302 },
  { month: "Jul", kg: 21300, lots: 356 },
  { month: "Aug", kg: 24800, lots: 412 },
];

export const materialDistribution = [
  { name: "E-Waste", value: 38 },
  { name: "Metal", value: 27 },
  { name: "Plastic", value: 18 },
  { name: "Paper", value: 11 },
  { name: "Glass", value: 6 },
];

export const transactionTrends = [
  { month: "Mar", value: 940000 },
  { month: "Apr", value: 1120000 },
  { month: "May", value: 1080000 },
  { month: "Jun", value: 1390000 },
  { month: "Jul", value: 1620000 },
  { month: "Aug", value: 1880000 },
];

export const completedVsPending = [
  { name: "Completed", value: 1842 },
  { name: "Pending", value: 316 },
];

export const growthData = [
  { month: "Mar", collectors: 620, recyclers: 41 },
  { month: "Apr", collectors: 780, recyclers: 48 },
  { month: "May", collectors: 910, recyclers: 55 },
  { month: "Jun", collectors: 1140, recyclers: 63 },
  { month: "Jul", collectors: 1390, recyclers: 71 },
  { month: "Aug", collectors: 1684, recyclers: 82 },
];

export const cityCollection = [
  { city: "Indore", kg: 6120, lots: 98, lat: 22.72, lng: 75.86 },
  { city: "Pune", kg: 5480, lots: 91, lat: 18.52, lng: 73.86 },
  { city: "Jaipur", kg: 4890, lots: 84, lat: 26.91, lng: 75.79 },
  { city: "Lucknow", kg: 3210, lots: 62, lat: 26.85, lng: 80.95 },
  { city: "Bhopal", kg: 2760, lots: 51, lat: 23.26, lng: 77.41 },
  { city: "Nagpur", kg: 2340, lots: 46, lat: 21.15, lng: 79.09 },
];

export const collectorById = (id: string) => collectors.find((c) => c.id === id);
export const recyclerById = (id: string) => recyclers.find((r) => r.id === id);
export const lotValue = (l: Lot) => Math.round(l.weightKg * l.ratePerKg);

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export const statusLabel: Record<LotStatus, string> = {
  listed: "Listed",
  matched: "Matched",
  pickup_scheduled: "Pickup Scheduled",
  in_transit: "In Transit",
  delivered: "Delivered",
  paid: "Paid",
  cancelled: "Cancelled",
};

export const traceSteps = [
  "Lot created by collector",
  "Smart matching with recycler",
  "Offer accepted",
  "Pickup scheduled",
  "Material in transit",
  "Digital handover & weighing",
  "Payment released",
  "Formal recycling certificate issued",
];
