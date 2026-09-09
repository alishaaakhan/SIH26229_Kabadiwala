import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Bell,
  BarChart3,
  Boxes,
  Building2,
  ClipboardList,
  FileBarChart,
  Handshake,
  IndianRupee,
  LayoutDashboard,
  LogOut,
  Map as MapIcon,
  Menu,
  Package,
  Receipt,
  Recycle,
  Route as RouteIcon,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Wifi,
  WifiOff,
  Tags,
  Truck,
  User,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/store";
import { LanguageSelect } from "@/components/language-select";
import type { Role } from "@/lib/demo-data";

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export const navByRole: Record<Role, NavItem[]> = {
  collector: [
    { label: "Dashboard", to: "/collector", icon: LayoutDashboard },
    { label: "Sell", to: "/collector/sell", icon: Sparkles },
    { label: "My Lots", to: "/collector/lots", icon: Package },
    { label: "Prices", to: "/collector/prices", icon: Tags },
    { label: "Find Recycler", to: "/collector/recyclers", icon: Search },
    { label: "Pickup", to: "/collector/pickup", icon: Truck },
    { label: "Earnings", to: "/collector/earnings", icon: IndianRupee },
    { label: "Transactions", to: "/collector/transactions", icon: Receipt },
    { label: "Notifications", to: "/collector/notifications", icon: Bell },
    { label: "Safety", to: "/collector/safety", icon: ShieldCheck },
    { label: "Profile", to: "/collector/profile", icon: User },
  ],
  recycler: [
    { label: "Dashboard", to: "/recycler", icon: LayoutDashboard },
    { label: "Incoming Lots", to: "/recycler/incoming", icon: Boxes },
    { label: "Offers", to: "/recycler/offers", icon: Handshake },
    { label: "Pickups", to: "/recycler/pickups", icon: Truck },
    { label: "Transactions", to: "/recycler/transactions", icon: Receipt },
    { label: "Profile", to: "/recycler/profile", icon: Building2 },
  ],
  admin: [
    { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
    { label: "Collectors", to: "/admin/collectors", icon: Users },
    { label: "Recyclers", to: "/admin/recyclers", icon: Recycle },
    { label: "Lots", to: "/admin/lots", icon: Package },
    { label: "Transactions", to: "/admin/transactions", icon: Receipt },
    { label: "Traceability", to: "/admin/traceability", icon: RouteIcon },
    { label: "Prices", to: "/admin/prices", icon: Tags },
    { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
    { label: "Map", to: "/admin/map", icon: MapIcon },
    { label: "Reports", to: "/admin/reports", icon: FileBarChart },
  ],
};

const roleTitle: Record<Role, string> = {
  collector: "Collector",
  recycler: "Recycler",
  admin: "Govt. Monitoring",
};

export function AppShell({ role, children }: { role: Role; children: ReactNode }) {
  const { user, ready, logout } = useAuth();
  const { offline, setOffline, syncNow, pendingSyncCount } = useData();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = navByRole[role];

  useEffect(() => {
    if (ready && (!user || user.role !== role)) {
      navigate({ to: "/login", replace: true });
    }
  }, [ready, user, role, navigate]);

  useEffect(() => setOpen(false), [pathname]);

  if (!ready || !user || user.role !== role) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  const isActive = (to: string) => (to === `/${role}` ? pathname === to : pathname.startsWith(to));

  const navLinks = (
    <nav className="space-y-1">
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
            isActive(item.to)
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-secondary",
          )}
        >
          <item.icon className="size-5 shrink-0" />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="grid size-10 place-items-center rounded-xl border border-border lg:hidden"
          >
            <Menu className="size-5" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Recycle className="size-5" />
            </span>
            <span className="hidden text-sm font-semibold sm:block">Kabadiwala Connect</span>
          </Link>
          <span className="ml-auto hidden rounded-full bg-warning/20 px-2.5 py-1 text-[11px] font-semibold text-warning sm:inline">
            SIH Demo Mode
          </span>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            {roleTitle[role]}
          </span>
          <LanguageSelect />
          <button
            onClick={() => {
              logout();
              navigate({ to: "/login", replace: true });
            }}
            className="grid size-10 place-items-center rounded-xl border border-border hover:bg-secondary"
            aria-label="Sign out"
          >
            <LogOut className="size-5" />
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-border bg-sidebar p-3 lg:block">
          {navLinks}
        </aside>

        {open ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-foreground/40"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <div className="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-sidebar p-3">
              <div className="mb-3 flex items-center justify-between px-1">
                <p className="text-sm font-semibold">Menu</p>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid size-9 place-items-center rounded-xl border border-border"
                >
                  <X className="size-4" />
                </button>
              </div>
              {navLinks}
            </div>
          </div>
        ) : null}

        <main className="min-w-0 flex-1 px-4 pb-28 pt-5 lg:pb-10">
          {role === "collector" ? (
            <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card p-3 text-sm shadow-sm">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
                  offline ? "bg-destructive/10 text-destructive" : "bg-success/15 text-success",
                )}
              >
                {offline ? <WifiOff className="size-4" /> : <Wifi className="size-4" />}
                {offline ? "Offline" : "Online"}
              </span>
              {pendingSyncCount > 0 ? (
                <span className="rounded-full bg-warning/20 px-3 py-1.5 text-xs font-semibold text-warning">
                  {pendingSyncCount} pending sync
                </span>
              ) : null}
              <button
                onClick={() => setOffline(!offline)}
                className="ml-auto rounded-xl border border-border px-3 py-2 text-xs font-semibold"
              >
                {offline ? "Go back online" : "Simulate Offline Mode"}
              </button>
              <button
                onClick={syncNow}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
              >
                <RefreshCw className="size-4" /> Sync Now
              </button>
            </div>
          ) : null}
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-card lg:hidden">
        {items.slice(0, 5).map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
              isActive(item.to) ? "text-primary" : "text-muted-foreground",
            )}
          >
            <item.icon className="size-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export { ClipboardList };
