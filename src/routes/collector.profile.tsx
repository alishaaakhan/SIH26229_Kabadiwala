import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, LogOut, Star } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/ui-bits";
import { useAuth } from "@/lib/auth";
import { collectorById, inr } from "@/lib/demo-data";

export const Route = createFileRoute("/collector/profile")({
  component: Profile,
});

function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const me = collectorById("C-101")!;
  const [online, setOnline] = useState(true);
  const [upi, setUpi] = useState("ramesh@upi");
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-4">
      <PageHeader title="Profile" subtitle="Your verified collector identity." />

      <SectionCard title="Collector details">
        <div className="flex items-center gap-4">
          <span className="grid size-16 place-items-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
            RK
          </span>
          <div>
            <p className="flex items-center gap-1.5 text-lg font-semibold">
              {me.name} <BadgeCheck className="size-4 text-primary" />
            </p>
            <p className="text-sm text-muted-foreground">
              {me.id} · +91 {me.mobile} · {me.city}
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-sm">
              <Star className="size-4 text-warning" /> {me.rating} rating
            </p>
          </div>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-secondary/60 p-3">
            <dt className="text-xs text-muted-foreground">Total material</dt>
            <dd className="text-lg font-semibold">{me.totalKg} kg</dd>
          </div>
          <div className="rounded-2xl bg-secondary/60 p-3">
            <dt className="text-xs text-muted-foreground">Total earned</dt>
            <dd className="text-lg font-semibold">{inr(me.totalEarned)}</dd>
          </div>
        </dl>
      </SectionCard>

      <SectionCard title="Availability">
        <button
          onClick={() => setOnline((o) => !o)}
          className="flex w-full items-center justify-between rounded-xl border border-border p-4 text-sm font-medium"
        >
          Accepting new pickups
          <span
            className={
              "rounded-full px-3 py-1 text-xs " +
              (online ? "bg-success/15 text-success" : "bg-secondary text-muted-foreground")
            }
          >
            {online ? "Online" : "Offline"}
          </span>
        </button>
      </SectionCard>

      <SectionCard title="Payment settings">
        <label className="text-sm font-medium">
          UPI ID
          <input
            value={upi}
            onChange={(e) => {
              setUpi(e.target.value);
              setSaved(false);
            }}
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-3 text-base"
          />
        </label>
        <button
          onClick={() => setSaved(true)}
          className="mt-3 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
        >
          {saved ? "Saved ✓" : "Save payment details"}
        </button>
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
