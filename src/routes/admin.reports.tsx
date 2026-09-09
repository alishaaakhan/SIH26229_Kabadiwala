import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, FileBarChart } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/ui-bits";
import { useData } from "@/lib/store";
import { collectorById, inr, lotValue, recyclerById } from "@/lib/demo-data";

export const Route = createFileRoute("/admin/reports")({
  component: Reports,
});

const reports = [
  { id: "monthly", title: "Monthly collection report", desc: "Material collected per city and category." },
  { id: "epr", title: "EPR compliance summary", desc: "Recycler-wise processed quantity for filing." },
  { id: "formalisation", title: "Formalisation progress", desc: "Collector verification and activity rates." },
  { id: "ledger", title: "Transaction ledger", desc: "All settlements with status and mode." },
];

function Reports() {
  const { lots } = useData();
  const [generated, setGenerated] = useState<string | null>(null);

  const downloadCsv = () => {
    const header = "Lot ID,Material,Category,Collector,Recycler,Weight (kg),Value (INR),City,Status\n";
    const body = lots
      .map((l) =>
        [
          l.id,
          l.material,
          l.category,
          collectorById(l.collectorId)?.name ?? "",
          l.recyclerId ? (recyclerById(l.recyclerId)?.name ?? "") : "",
          l.weightKg,
          lotValue(l),
          l.city,
          l.status,
        ].join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(new Blob([header + body], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "kabadiwala-connect-lots.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Reports" subtitle="Generate audit-ready reports for the ministry." />
      <div className="grid gap-3 lg:grid-cols-2">
        {reports.map((r) => (
          <div key={r.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <FileBarChart className="size-5" />
            </span>
            <p className="mt-3 font-semibold">{r.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
            <button
              onClick={() => setGenerated(r.id)}
              className="mt-4 w-full rounded-xl bg-secondary py-3.5 text-sm font-semibold"
            >
              {generated === r.id ? "Report generated ✓" : "Generate report"}
            </button>
          </div>
        ))}
      </div>

      <SectionCard title="Export raw data">
        <p className="text-sm text-muted-foreground">
          Download the complete lot register ({lots.length} records) as a CSV file.
        </p>
        <button
          onClick={downloadCsv}
          className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground"
        >
          <Download className="size-4" /> Download CSV
        </button>
      </SectionCard>
    </div>
  );
}
