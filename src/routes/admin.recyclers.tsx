import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, MapPin } from "lucide-react";
import { PageHeader } from "@/components/ui-bits";
import { recyclers } from "@/lib/demo-data";

export const Route = createFileRoute("/admin/recyclers")({
  component: AdminRecyclers,
});

function AdminRecyclers() {
  return (
    <div className="space-y-4">
      <PageHeader title="Recyclers" subtitle="Registered and CPCB-verified processing facilities." />
      <div className="grid gap-3 lg:grid-cols-2">
        {recyclers.map((r) => (
          <div key={r.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-1.5 font-semibold">
                  {r.name}
                  {r.verified ? <BadgeCheck className="size-4 text-primary" /> : null}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3.5" /> {r.city} · {r.id}
                </p>
              </div>
              <span
                className={
                  "rounded-full px-2.5 py-1 text-xs font-medium " +
                  (r.verified ? "bg-success/15 text-success" : "bg-warning/20 text-warning")
                }
              >
                {r.verified ? "Verified" : "Pending review"}
              </span>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Capacity</dt>
                <dd className="font-medium">{r.capacityTpd} TPD</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Rating</dt>
                <dd className="font-medium">{r.rating} / 5</dd>
              </div>
            </dl>
            <div className="mt-3 flex flex-wrap gap-2">
              {r.materials.map((m) => (
                <span key={m} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
                  {m}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
