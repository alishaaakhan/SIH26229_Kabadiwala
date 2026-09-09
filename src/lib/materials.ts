// Transparent price engine + demo AI material classification.
// Prototype only: no external AI API is used.

export type MaterialCategory = "E-Waste" | "Metal" | "Plastic" | "Paper" | "Glass";

export interface MaterialSpec {
  key: string;
  label: string;
  category: MaterialCategory;
  /** Base indicative price per kg (₹) */
  basePrice: number;
  /** Quality multiplier — condition / purity of the material */
  quality: number;
  /** Demand multiplier — current recycler demand */
  demand: number;
  /** Share of the weight that is recoverable material (for impact estimates) */
  recovery: number;
  /** Typical weight of one unit, used by the demo detector */
  typicalKg: number;
  hazard?: string;
}

export const materialCatalog: MaterialSpec[] = [
  { key: "pcb", label: "PCB", category: "E-Waste", basePrice: 300, quality: 1.0, demand: 1.08, recovery: 0.62, typicalKg: 15, hazard: "Contains lead solder — do not burn." },
  { key: "copper-cable", label: "Copper Cable", category: "Metal", basePrice: 620, quality: 1.0, demand: 1.05, recovery: 0.78, typicalKg: 22, hazard: "Never burn insulation to recover copper." },
  { key: "aluminium", label: "Aluminium", category: "Metal", basePrice: 165, quality: 1.02, demand: 1.0, recovery: 0.85, typicalKg: 30 },
  { key: "battery", label: "Battery", category: "E-Waste", basePrice: 210, quality: 0.95, demand: 1.12, recovery: 0.55, typicalKg: 8, hazard: "Swollen lithium cells can catch fire. Store dry, never puncture." },
  { key: "lcd", label: "LCD", category: "E-Waste", basePrice: 95, quality: 0.9, demand: 1.02, recovery: 0.4, typicalKg: 12, hazard: "Backlight tubes may contain mercury." },
  { key: "led", label: "LED", category: "E-Waste", basePrice: 120, quality: 0.98, demand: 1.04, recovery: 0.45, typicalKg: 10 },
  { key: "mobile-phone", label: "Mobile Phone", category: "E-Waste", basePrice: 260, quality: 1.0, demand: 1.15, recovery: 0.58, typicalKg: 6 },
  { key: "laptop", label: "Laptop", category: "E-Waste", basePrice: 190, quality: 1.0, demand: 1.1, recovery: 0.6, typicalKg: 18 },
  { key: "charger", label: "Charger", category: "E-Waste", basePrice: 140, quality: 0.96, demand: 1.0, recovery: 0.5, typicalKg: 5 },
  { key: "hard-drive", label: "Hard Drive", category: "E-Waste", basePrice: 230, quality: 1.0, demand: 1.06, recovery: 0.66, typicalKg: 7, hazard: "Wipe or destroy data platters before handover." },
  { key: "motor", label: "Motor", category: "Metal", basePrice: 175, quality: 1.0, demand: 1.03, recovery: 0.72, typicalKg: 25 },
  { key: "mixed-ewaste", label: "Mixed E-Waste", category: "E-Waste", basePrice: 110, quality: 0.88, demand: 1.0, recovery: 0.42, typicalKg: 20 },
];

export const materialByKey = (key: string) => materialCatalog.find((m) => m.key === key);
export const materialByLabel = (label: string) =>
  materialCatalog.find((m) => m.label.toLowerCase() === label.toLowerCase());

/** Price overrides that the admin can edit in the demo. */
export type PriceOverrides = Record<string, { basePrice?: number; quality?: number; demand?: number }>;

export function effectiveSpec(spec: MaterialSpec, overrides?: PriceOverrides): MaterialSpec {
  const o = overrides?.[spec.key];
  if (!o) return spec;
  return {
    ...spec,
    basePrice: o.basePrice ?? spec.basePrice,
    quality: o.quality ?? spec.quality,
    demand: o.demand ?? spec.demand,
  };
}

/** Final indicative price/kg = base × quality × demand */
export function indicativePrice(spec: MaterialSpec, overrides?: PriceOverrides) {
  const s = effectiveSpec(spec, overrides);
  return Math.round(s.basePrice * s.quality * s.demand);
}

export const PRICE_DISCLAIMER =
  "Indicative market price for prototype demonstration. Actual recycler price may vary.";

export const AI_DISCLAIMER = "AI-assisted prototype prediction";

export interface Detection {
  spec: MaterialSpec;
  confidence: number;
  estWeightKg: number;
  pricePerKg: number;
  alternatives: { spec: MaterialSpec; confidence: number }[];
}

function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/**
 * Demo classifier. Deterministic from the uploaded file's name + size, so the
 * same photo always yields the same prediction. Filenames containing a known
 * material word are matched directly, which makes live demos predictable.
 */
export function classifyImage(
  fileName: string,
  fileSize: number,
  overrides?: PriceOverrides,
): Detection {
  const lower = fileName.toLowerCase();
  const named = materialCatalog.find(
    (m) => lower.includes(m.key) || lower.includes(m.label.toLowerCase().replace(/\s+/g, "")),
  );
  const h = hash(`${fileName}:${fileSize}`);
  const primary = named ?? materialCatalog[h % materialCatalog.length]!;
  const confidence = named ? 96 : 78 + (h % 19);

  const others = materialCatalog
    .filter((m) => m.key !== primary.key && m.category === primary.category)
    .slice(0, 3)
    .map((spec, i) => ({ spec, confidence: Math.max(4, confidence - 22 - i * 9) }));

  const jitter = ((h >> 5) % 40) / 100 - 0.2; // ±20%
  const estWeightKg = Math.max(1, Math.round(primary.typicalKg * (1 + jitter)));

  return {
    spec: primary,
    confidence,
    estWeightKg,
    pricePerKg: indicativePrice(primary, overrides),
    alternatives: others,
  };
}
