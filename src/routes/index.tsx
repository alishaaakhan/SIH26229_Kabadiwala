import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeIndianRupee,
  BarChart3,
  Boxes,
  ClipboardCheck,
  Handshake,
  IndianRupee,
  LineChart,
  MapPin,
  Package,
  Recycle,
  Search,
  ShieldCheck,
  Truck,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kabadiwala Connect — Formalising India's Recycling Chain" },
      {
        name: "description",
        content:
          "Kabadiwala Connect links informal waste collectors with formal recyclers through transparent pricing, smart matching, digital transactions and full traceability.",
      },
      { property: "og:title", content: "Kabadiwala Connect — Formalising India's Recycling Chain" },
      {
        property: "og:description",
        content:
          "Transparent pricing, smart matching, digital handover and traceability for India's informal waste collectors.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const flow: { label: string; icon: LucideIcon }[] = [
  { label: "Collector", icon: Users },
  { label: "Digital Lot", icon: Package },
  { label: "Smart Matching", icon: Search },
  { label: "Recycler", icon: Recycle },
  { label: "Pickup", icon: Truck },
  { label: "Digital Handover", icon: ClipboardCheck },
  { label: "Payment", icon: Wallet },
  { label: "Formal Recycling", icon: ShieldCheck },
];

const collectorPoints = [
  { title: "Better price transparency", body: "Live ward-level rates for every material, updated daily.", icon: BadgeIndianRupee },
  { title: "Recycler discovery", body: "Find verified recyclers nearby sorted by rate and distance.", icon: Search },
  { title: "Digital records", body: "Every lot, weight and payment stored as a digital receipt.", icon: ClipboardCheck },
  { title: "Pickup", body: "Schedule doorstep pickup instead of hauling material yourself.", icon: Truck },
  { title: "Payment", body: "Direct UPI or bank settlement with no middleman deductions.", icon: Wallet },
  { title: "Safety", body: "Handling guidance and PPE alerts for hazardous e-waste.", icon: ShieldCheck },
];

const recyclerPoints = [
  { title: "Reliable material sourcing", body: "A steady, verified supply pipeline from local collectors.", icon: Boxes },
  { title: "Digital lots", body: "Material type, weight and photos before you commit an offer.", icon: Package },
  { title: "Pickup management", body: "Plan routes, assign vehicles and track handover status.", icon: Truck },
  { title: "Transaction records", body: "Audit-ready ledgers for EPR and compliance reporting.", icon: Handshake },
];

const govPoints = [
  { title: "Traceability", body: "Follow each kilogram from collector to formal recycling.", icon: MapPin },
  { title: "Analytics", body: "Material flows, transaction value and district-level trends.", icon: BarChart3 },
  { title: "Collection visibility", body: "See what is collected, where, and by whom in real time.", icon: LineChart },
  { title: "Formalization", body: "Verify collectors and bring them into the formal economy.", icon: ShieldCheck },
];

function PointGrid({ items }: { items: { title: string; body: string; icon: LucideIcon }[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <div key={p.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <p.icon className="size-5" />
          </span>
          <h3 className="mt-3 font-semibold">{p.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
        </div>
      ))}
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Recycle className="size-5" />
          </span>
          <span className="font-semibold tracking-tight">Kabadiwala Connect</span>
          <span className="ml-auto hidden text-xs text-muted-foreground sm:block">
            Ministry of Mines · SIH26229
          </span>
          <Link
            to="/login"
            className="ml-3 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Login
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          <Recycle className="size-3.5" /> Clean & Green Technology
        </span>
        <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          Bring Every Kabadiwala Into the Formal Recycling Chain
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Kabadiwala Connect digitally connects informal waste collectors with formal recyclers
          through transparent pricing, smart matching, digital transactions and traceability.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground"
          >
            Start Selling <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-4 text-base font-semibold"
          >
            Explore Demo
          </Link>
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { k: "1,684", v: "Collectors onboarded" },
            { k: "82", v: "Verified recyclers" },
            { k: "24.8 T", v: "Collected in August" },
            { k: "₹18.8 L", v: "Monthly transaction value" },
          ].map((s) => (
            <div key={s.v} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <dt className="text-xl font-bold text-primary">{s.k}</dt>
              <dd className="mt-1 text-xs text-muted-foreground">{s.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="border-y border-border bg-secondary/40 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-semibold tracking-tight">How the ecosystem works</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            One traceable chain from the street collector to certified recycling.
          </p>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {flow.map((step, i) => (
              <li
                key={step.label}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <step.icon className="size-5" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Step {i + 1}</p>
                  <p className="font-medium">{step.label}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold tracking-tight">For Collectors</h2>
        <p className="mb-5 mt-1 text-sm text-muted-foreground">
          Built for a low-cost Android phone, in the field.
        </p>
        <PointGrid items={collectorPoints} />
      </section>

      <section className="border-t border-border bg-secondary/40 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-semibold tracking-tight">For Recyclers</h2>
          <p className="mb-5 mt-1 text-sm text-muted-foreground">
            Predictable feedstock with compliance-ready paperwork.
          </p>
          <PointGrid items={recyclerPoints} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold tracking-tight">For Government</h2>
        <p className="mb-5 mt-1 text-sm text-muted-foreground">
          Policy-grade visibility into the informal recycling economy.
        </p>
        <PointGrid items={govPoints} />
      </section>

      <section className="border-t border-border bg-primary/5 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Try the working prototype</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Three demo logins: collector, recycler and government monitoring.
            </p>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground"
          >
            <IndianRupee className="size-4" /> Explore Demo
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-4 text-sm text-muted-foreground">
          Kabadiwala Connect · Smart India Hackathon 2026 · Problem Statement SIH26229 · Ministry of
          Mines
        </div>
      </footer>
    </div>
  );
}
