import { createFileRoute } from "@tanstack/react-router";
import { Bell, HandCoins, ShieldCheck, Truck, Wallet } from "lucide-react";
import { PageHeader } from "@/components/ui-bits";
import { useData } from "@/lib/store";

export const Route = createFileRoute("/collector/notifications")({
  component: Notifications,
});

const icons = {
  offer: HandCoins,
  pickup: Truck,
  payment: Wallet,
  system: Bell,
  safety: ShieldCheck,
};

function Notifications() {
  const { notifications, markAllRead, toggleRead } = useData();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-4">
      <PageHeader title="Notifications" subtitle={`${unread} unread updates`} />
      <button
        onClick={markAllRead}
        className="rounded-xl bg-secondary px-4 py-3 text-sm font-semibold"
      >
        Mark all as read
      </button>
      <ul className="space-y-3">
        {notifications.map((n) => {
          const Icon = icons[n.type];
          return (
            <li key={n.id}>
              <button
                onClick={() => toggleRead(n.id)}
                className={
                  "flex w-full gap-3 rounded-2xl border border-border p-4 text-left shadow-sm " +
                  (n.read ? "bg-card" : "bg-primary/5")
                }
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-medium">{n.title}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{n.time}</span>
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">{n.body}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
