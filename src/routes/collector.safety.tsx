import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, HardHat, PhoneCall, ShieldCheck } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/ui-bits";

export const Route = createFileRoute("/collector/safety")({
  component: Safety,
});

const checklist = [
  "Wear cut-resistant gloves before sorting e-waste",
  "Never burn cables or plastic to recover metal",
  "Keep batteries in a dry, non-metal container",
  "Use a mask while handling CRT glass and toner dust",
  "Wash hands before eating; keep drinking water separate",
  "Report leaking or swollen batteries to the recycler",
];

const helplines = [
  { label: "Pollution Control Board helpline", number: "1800-180-1551" },
  { label: "Municipal waste cell (Indore)", number: "0731-2535555" },
  { label: "Emergency medical", number: "108" },
];

function Safety() {
  const [done, setDone] = useState<string[]>([]);

  return (
    <div className="space-y-4">
      <PageHeader title="Safety" subtitle="Handle hazardous material the right way, every day." />

      <div className="flex items-start gap-3 rounded-2xl border border-warning/40 bg-warning/10 p-4">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" />
        <p className="text-sm">
          Lithium batteries and CRT monitors are hazardous. Never break them open — hand them over
          only to a verified recycler on this platform.
        </p>
      </div>

      <SectionCard title="Daily safety checklist">
        <ul className="space-y-2">
          {checklist.map((c) => (
            <li key={c}>
              <button
                onClick={() =>
                  setDone((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]))
                }
                className="flex w-full items-center gap-3 rounded-xl border border-border p-3.5 text-left text-sm"
              >
                <span
                  className={
                    "grid size-6 shrink-0 place-items-center rounded-md border " +
                    (done.includes(c)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border")
                  }
                >
                  {done.includes(c) ? "✓" : ""}
                </span>
                {c}
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          {done.length} of {checklist.length} completed today
        </p>
      </SectionCard>

      <SectionCard title="Protective equipment">
        <div className="grid gap-3 sm:grid-cols-3">
          {["Gloves", "N95 mask", "Safety goggles"].map((g) => (
            <div key={g} className="rounded-2xl bg-secondary/60 p-4 text-center">
              <HardHat className="mx-auto size-6 text-primary" />
              <p className="mt-2 text-sm font-medium">{g}</p>
              <p className="text-xs text-muted-foreground">Free at ward office</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Helplines">
        <ul className="space-y-2">
          {helplines.map((h) => (
            <li key={h.number}>
              <a
                href={`tel:${h.number}`}
                className="flex items-center justify-between rounded-xl border border-border p-4 text-sm"
              >
                <span>
                  <span className="block font-medium">{h.label}</span>
                  <span className="text-muted-foreground">{h.number}</span>
                </span>
                <PhoneCall className="size-5 text-primary" />
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 text-primary" /> Verified collectors are covered under the
          municipal accident insurance scheme.
        </p>
      </SectionCard>
    </div>
  );
}
