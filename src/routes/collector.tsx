import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/collector")({
  head: () => ({
    meta: [
      { title: "Collector Workspace — Kabadiwala Connect" },
      { name: "description", content: "Sell lots, track pickups and get paid digitally." },
    ],
  }),
  component: () => (
    <AppShell role="collector">
      <Outlet />
    </AppShell>
  ),
});
