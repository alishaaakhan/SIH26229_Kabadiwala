import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { LotStatus } from "@/lib/demo-data";
import { statusLabel } from "@/lib/demo-data";

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = "default",
}: {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  hint?: string;
  tone?: "default" | "primary" | "warning" | "info";
}) {
  const toneCls = {
    default: "bg-secondary text-secondary-foreground",
    primary: "bg-primary/10 text-primary",
    warning: "bg-warning/15 text-warning",
    info: "bg-info/15 text-info",
  }[tone];
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {Icon ? (
          <span className={cn("grid size-8 shrink-0 place-items-center rounded-xl", toneCls)}>
            <Icon className="size-4" />
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function SectionCard({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card p-4 shadow-sm", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
    </div>
  );
}

const statusTone: Record<LotStatus, string> = {
  listed: "bg-secondary text-secondary-foreground",
  matched: "bg-info/15 text-info",
  pickup_scheduled: "bg-warning/20 text-warning",
  in_transit: "bg-info/15 text-info",
  delivered: "bg-primary/10 text-primary",
  paid: "bg-success/15 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

export function StatusPill({ status }: { status: LotStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        statusTone[status],
      )}
    >
      {statusLabel[status]}
    </span>
  );
}

export function TxnPill({ status }: { status: "completed" | "pending" | "processing" }) {
  const tone = {
    completed: "bg-success/15 text-success",
    pending: "bg-warning/20 text-warning",
    processing: "bg-info/15 text-info",
  }[status];
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize", tone)}>
      {status}
    </span>
  );
}

export function EmptyRow({ text }: { text: string }) {
  return <p className="py-6 text-center text-sm text-muted-foreground">{text}</p>;
}
