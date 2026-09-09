import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  BadgeCheck,
  Camera,
  Check,
  ChevronRight,
  Columns3,
  ScanLine,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { PageHeader, SectionCard } from "@/components/ui-bits";
import { useData } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { inr } from "@/lib/demo-data";
import {
  AI_DISCLAIMER,
  classifyImage,
  effectiveSpec,
  indicativePrice,
  materialCatalog,
  PRICE_DISCLAIMER,
  type Detection,
  type MaterialSpec,
} from "@/lib/materials";
import { matchRecyclers, type RecyclerMatch } from "@/lib/matching";

export const Route = createFileRoute("/collector/sell")({
  head: () => ({
    meta: [
      { title: "Sell E-Waste — Kabadiwala Connect" },
      {
        name: "description",
        content:
          "Photograph your scrap, get an AI-assisted material estimate, see the indicative price and pick the best matched recycler.",
      },
      { property: "og:title", content: "Sell E-Waste — Kabadiwala Connect" },
      {
        property: "og:description",
        content: "AI-assisted material identification, transparent pricing and smart recycler matching.",
      },
    ],
  }),
  component: SellFlow,
});

const steps = ["Photo", "Material", "Weight & Price", "Recycler", "Done"];

function SellFlow() {
  const { addLot, prices } = useData();
  const { t } = useI18n();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [detection, setDetection] = useState<Detection | null>(null);
  const [spec, setSpec] = useState<MaterialSpec | null>(null);
  const [weight, setWeight] = useState("15");
  const [compare, setCompare] = useState(false);
  const [details, setDetails] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const weightKg = Number(weight) || 0;
  const priced = spec ? effectiveSpec(spec, prices) : null;
  const pricePerKg = spec ? indicativePrice(spec, prices) : 0;
  const matches = useMemo<RecyclerMatch[]>(
    () => (spec ? matchRecyclers(spec, weightKg, prices).slice(0, 5) : []),
    [spec, weightKg, prices],
  );

  function onFile(file: File) {
    setPreview(URL.createObjectURL(file));
    setScanning(true);
    setStep(1);
    window.setTimeout(() => {
      const d = classifyImage(file.name, file.size, prices);
      setDetection(d);
      setSpec(d.spec);
      setWeight(String(d.estWeightKg));
      setScanning(false);
    }, 1100);
  }

  function selectRecycler(m: RecyclerMatch) {
    if (!spec) return;
    const lot = addLot({
      material: spec.label,
      materialKey: spec.key,
      category: spec.category,
      weightKg: weightKg || 1,
      ratePerKg: m.offerPerKg,
      collectorId: "C-101",
      city: "Indore",
      recyclerId: m.recycler.id,
      matchScore: m.score,
      aiConfidence: detection?.confidence ?? 0,
      status: "matched",
      pickupSlot: m.pickupEta,
    });
    setCreatedId(lot.id);
    setStep(4);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title={t("sell")}
        subtitle="Photo → AI material check → indicative price → best matched recycler. Four taps."
      />

      <ol className="flex gap-1 overflow-x-auto pb-1">
        {steps.map((s, i) => (
          <li
            key={s}
            className={
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold " +
              (i === step
                ? "bg-primary text-primary-foreground"
                : i < step
                  ? "bg-success/15 text-success"
                  : "bg-secondary text-muted-foreground")
            }
          >
            {i + 1}. {s}
          </li>
        ))}
      </ol>

      {/* STEP 0 — photo */}
      {step === 0 ? (
        <SectionCard title="Upload a photo of the material">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 py-10 text-center"
          >
            <Camera className="size-8 text-primary" />
            <span className="text-base font-semibold">Take or choose a photo</span>
            <span className="text-xs text-muted-foreground">JPG or PNG · stays on your phone</span>
          </button>
          <button
            onClick={() => {
              const d = classifyImage("pcb-demo.jpg", 240000, prices);
              setDetection(d);
              setSpec(d.spec);
              setWeight("15");
              setStep(1);
            }}
            className="mt-3 w-full rounded-xl border border-border py-3.5 text-sm font-semibold"
          >
            Skip photo — use the SIH demo sample (PCB)
          </button>
        </SectionCard>
      ) : null}

      {/* STEP 1 — detection */}
      {step === 1 ? (
        <SectionCard title="AI-assisted material analysis">
          <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
            <div className="grid h-40 place-items-center overflow-hidden rounded-2xl border border-border bg-secondary/50">
              {preview ? (
                <img src={preview} alt="Uploaded material" className="h-full w-full object-cover" />
              ) : (
                <ScanLine className="size-10 text-muted-foreground" />
              )}
            </div>
            {scanning || !detection ? (
              <p className="self-center text-sm text-muted-foreground">Analysing image…</p>
            ) : (
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/20 px-2.5 py-1 text-[11px] font-semibold text-warning">
                  <Sparkles className="size-3.5" /> {AI_DISCLAIMER}
                </span>
                <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Detected Material</dt>
                    <dd className="text-lg font-semibold">{spec?.label}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Confidence</dt>
                    <dd className="text-lg font-semibold text-primary">{detection.confidence}%</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Category</dt>
                    <dd className="font-medium">{spec?.category}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Estimated Weight</dt>
                    <dd className="font-medium">{detection.estWeightKg} kg</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-xs text-muted-foreground">Indicative Market Price</dt>
                    <dd className="font-semibold text-primary">₹{pricePerKg}/kg</dd>
                  </div>
                </dl>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${detection.confidence}%` }}
                  />
                </div>
                {detection.alternatives.length ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Other possibilities:{" "}
                    {detection.alternatives.map((a) => `${a.spec.label} ${a.confidence}%`).join(" · ")}
                  </p>
                ) : null}
              </div>
            )}
          </div>

          {!scanning && detection ? (
            <>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setStep(2)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-4 text-base font-semibold text-primary-foreground"
                >
                  <Check className="size-5" /> Confirm Detection
                </button>
                <button
                  onClick={() => setStep(0)}
                  className="rounded-xl border border-border px-4 py-4 text-sm font-semibold"
                >
                  Retake photo
                </button>
              </div>
              <p className="mt-4 text-sm font-medium">Change Material</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {materialCatalog.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setSpec(m)}
                    className={
                      "rounded-full px-3.5 py-2 text-sm font-medium " +
                      (spec?.key === m.key ? "bg-primary text-primary-foreground" : "bg-secondary")
                    }
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </SectionCard>
      ) : null}

      {/* STEP 2 — weight & price */}
      {step === 2 && spec && priced ? (
        <SectionCard title="Weight and indicative price">
          <label className="block text-sm font-medium">
            Weight (kg)
            <input
              inputMode="numeric"
              value={weight}
              onChange={(e) => setWeight(e.target.value.replace(/\D/g, "").slice(0, 5))}
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-4 text-2xl font-semibold"
            />
          </label>
          <div className="mt-3 flex gap-2">
            {[5, 10, 25, 50].map((n) => (
              <button
                key={n}
                onClick={() => setWeight(String((Number(weight) || 0) + n))}
                className="flex-1 rounded-xl bg-secondary py-3 text-sm font-semibold"
              >
                +{n} kg
              </button>
            ))}
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-3 py-2.5 text-muted-foreground">Material</td>
                  <td className="px-3 py-2.5 text-right font-medium">{spec.label}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-2.5 text-muted-foreground">Base price / kg</td>
                  <td className="px-3 py-2.5 text-right font-medium">₹{priced.basePrice}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-2.5 text-muted-foreground">Quality multiplier</td>
                  <td className="px-3 py-2.5 text-right font-medium">×{priced.quality}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-2.5 text-muted-foreground">Demand multiplier</td>
                  <td className="px-3 py-2.5 text-right font-medium">×{priced.demand}</td>
                </tr>
                <tr className="bg-primary/5">
                  <td className="px-3 py-3 font-semibold">Today's indicative price</td>
                  <td className="px-3 py-3 text-right text-lg font-bold text-primary">
                    ₹{pricePerKg}/kg
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-base">
            Estimated lot value:{" "}
            <span className="text-xl font-bold text-primary">{inr(pricePerKg * weightKg)}</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{PRICE_DISCLAIMER}</p>

          <button
            onClick={() => setStep(3)}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-base font-semibold text-primary-foreground"
          >
            Find matching recyclers <ChevronRight className="size-5" />
          </button>
        </SectionCard>
      ) : null}

      {/* STEP 3 — matching */}
      {step === 3 && spec ? (
        <SectionCard
          title="Smart recycler matching"
          action={
            <button
              onClick={() => setCompare((c) => !c)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-semibold"
            >
              <Columns3 className="size-4" /> {compare ? "Card view" : "Compare"}
            </button>
          }
        >
          {compare ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="py-2 pr-3">Recycler</th>
                    <th className="py-2 pr-3">Match</th>
                    <th className="py-2 pr-3">Offer</th>
                    <th className="py-2 pr-3">Distance</th>
                    <th className="py-2 pr-3">Rating</th>
                    <th className="py-2 pr-3">Verified</th>
                    <th className="py-2 pr-3">Accepts</th>
                    <th className="py-2 pr-3">Pickup</th>
                    <th className="py-2 pr-3">Capacity</th>
                    <th className="py-2" />
                  </tr>
                </thead>
                <tbody>
                  {matches.map((m) => (
                    <tr key={m.recycler.id} className="border-b border-border last:border-0">
                      <td className="py-3 pr-3 font-medium">{m.recycler.name}</td>
                      <td className="py-3 pr-3 font-semibold text-primary">{m.score}%</td>
                      <td className="py-3 pr-3">₹{m.offerPerKg}/kg</td>
                      <td className="py-3 pr-3">{m.recycler.distanceKm} km</td>
                      <td className="py-3 pr-3">{m.recycler.rating}</td>
                      <td className="py-3 pr-3">{m.recycler.verified ? "Yes" : "Pending"}</td>
                      <td className="py-3 pr-3">{m.recycler.materials.join(", ")}</td>
                      <td className="py-3 pr-3">{m.pickupEta}</td>
                      <td className="py-3 pr-3">{m.recycler.capacityTpd} TPD</td>
                      <td className="py-3">
                        <button
                          onClick={() => selectRecycler(m)}
                          className="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <ul className="grid gap-3 lg:grid-cols-2">
              {matches.map((m) => (
                <li key={m.recycler.id} className="rounded-2xl border border-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="flex items-center gap-1.5 font-semibold">
                        {m.recycler.name}
                        {m.recycler.verified ? <BadgeCheck className="size-4 text-primary" /> : null}
                      </p>
                      <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="size-3.5 text-warning" /> {m.recycler.rating} ·{" "}
                        {m.recycler.city}
                      </p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
                      {m.score}% Match
                    </span>
                  </div>
                  <ul className="mt-3 space-y-1 text-sm">
                    {m.reasons.map((r) => (
                      <li key={r.text} className="flex items-center gap-2">
                        {r.ok ? (
                          <Check className="size-4 text-success" />
                        ) : (
                          <X className="size-4 text-muted-foreground" />
                        )}
                        <span className={r.ok ? "" : "text-muted-foreground"}>{r.text}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm">
                    Offer:{" "}
                    <span className="text-lg font-bold text-primary">₹{m.offerPerKg}/kg</span> ·{" "}
                    {inr(m.offerPerKg * weightKg)} for {weightKg} kg
                  </p>
                  {details === m.recycler.id ? (
                    <dl className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-secondary/50 p-3 text-xs">
                      <div>
                        <dt className="text-muted-foreground">Pickup time</dt>
                        <dd className="font-medium">{m.pickupEta}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Free capacity</dt>
                        <dd className="font-medium">{m.capacityFree.toLocaleString("en-IN")} kg</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Materials accepted</dt>
                        <dd className="font-medium">{m.recycler.materials.join(", ")}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Contact</dt>
                        <dd className="font-medium">{m.recycler.mobile}</dd>
                      </div>
                    </dl>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => setDetails((d) => (d === m.recycler.id ? null : m.recycler.id))}
                      className="rounded-xl border border-border px-4 py-3 text-sm font-semibold"
                    >
                      {details === m.recycler.id ? "Hide details" : "View Details"}
                    </button>
                    <button
                      onClick={() => setCompare(true)}
                      className="rounded-xl border border-border px-4 py-3 text-sm font-semibold"
                    >
                      Compare
                    </button>
                    <button
                      onClick={() => selectRecycler(m)}
                      className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                    >
                      Select Recycler
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-muted-foreground">{PRICE_DISCLAIMER}</p>
        </SectionCard>
      ) : null}

      {/* STEP 4 — done */}
      {step === 4 && createdId ? (
        <SectionCard title="Lot created">
          <p className="rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
            {createdId} created and matched. The recycler has been notified.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/collector/lot/$lotId"
              params={{ lotId: createdId }}
              className="rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground"
            >
              View traceability timeline
            </Link>
            <Link to="/collector/pickup" className="rounded-xl border border-border px-4 py-3.5 text-sm font-semibold">
              Schedule pickup
            </Link>
            <button
              onClick={() => {
                setStep(0);
                setPreview(null);
                setDetection(null);
                setSpec(null);
                setCreatedId(null);
              }}
              className="rounded-xl border border-border px-4 py-3.5 text-sm font-semibold"
            >
              Sell another lot
            </button>
            <button
              onClick={() => navigate({ to: "/collector" })}
              className="rounded-xl border border-border px-4 py-3.5 text-sm font-semibold"
            >
              Back to dashboard
            </button>
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}
