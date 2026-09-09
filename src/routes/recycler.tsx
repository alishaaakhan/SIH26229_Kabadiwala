import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/recycler")({
  head: () => ({
    meta: [
      { title: "Recycler Workspace — Kabadiwala Connect" },
      { name: "description", content: "Source material, manage pickups and settle payments." },
    ],
  }),
  component: () => (
    <AppShell role="recycler">
      <Outlet />
    </AppShell>
  ),
});
