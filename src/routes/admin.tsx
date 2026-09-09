import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Government Monitoring — Kabadiwala Connect" },
      { name: "description", content: "Traceability, analytics and formalisation monitoring." },
    ],
  }),
  component: () => (
    <AppShell role="admin">
      <Outlet />
    </AppShell>
  ),
});
