import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, LogOut } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/ui-bits";
import { useAuth } from "@/lib/auth";
import { recyclerById } from "@/lib/demo-data";

export const Route = createFileRoute("/recycler/profile")({
  component: RecyclerProfile,
});

function RecyclerProfile() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const me = recyclerById("R-201")!;
  const [accepting, setAccepting] = useState(true);
  const [radius, setRadius] = useState(15);

  return (
    <div className="space-y-4">
      <PageHeader title="Facility Profile" subtitle="Registration, capacity and sourcing rules." />

      <SectionCard title="Facility">
        <p className="flex items-center gap-1.5 text-lg font-semibold">
          {me.name} <BadgeCheck className="size-4 text-primary" />
        </p>
        <p className="text-sm text-muted-foreground">
          {me.id} · {me.city} · CPCB Reg. MP/EW/2024/0192
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-secondary/60 p-3">
            <dt className="text-xs text-muted-foreground">Capacity</dt>
            <dd className="text-lg font-semibold">{me.capacityTpd} TPD</dd>
          </div>
          <div className="rounded-2xl bg-secondary/60 p-3">
            <dt className="text-xs text-muted-foreground">Rating</dt>
            <dd className="text-lg font-semibold">{me.rating} / 5</dd>
          </div>
        </dl>
        <div className="mt-3 flex flex-wrap gap-2">
          {me.materials.map((m) => (
            <span key={m} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
              {m}
            </span>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Sourcing preferences">
        <button
          onClick={() => setAccepting((a) => !a)}
          className="flex w-full items-center justify-between rounded-xl border border-border p-4 text-sm font-medium"
        >
          Accepting new lots
          <span
            className={
              "rounded-full px-3 py-1 text-xs " +
              (accepting ? "bg-success/15 text-success" : "bg-secondary text-muted-foreground")
            }
          >
            {accepting ? "Open" : "Paused"}
          </span>
        </button>
        <label className="mt-4 block text-sm font-medium">
          Sourcing radius: {radius} km
          <input
            type="range"
            min={5}
            max={50}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="mt-2 w-full accent-primary"
          />
        </label>
      </SectionCard>

      <button
        onClick={() => {
          logout();
          navigate({ to: "/login", replace: true });
        }}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-4 text-sm font-semibold text-destructive"
      >
        <LogOut className="size-4" /> Sign out
      </button>
    </div>
  );
}
