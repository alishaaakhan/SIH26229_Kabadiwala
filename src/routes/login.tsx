import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Landmark, Recycle, ShieldCheck, User } from "lucide-react";
import { homeForRole, useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Kabadiwala Connect" },
      {
        name: "description",
        content: "Sign in as a collector, recycler or government monitoring officer.",
      },
      { property: "og:title", content: "Login — Kabadiwala Connect" },
      {
        property: "og:description",
        content: "Demo logins for collector, recycler and government monitoring dashboards.",
      },
    ],
  }),
  component: LoginPage,
});

const demos = [
  { label: "Collector Demo", mobile: "9999999999", icon: User, sub: "Ramesh Kumar · Indore" },
  {
    label: "Recycler Demo",
    mobile: "8888888888",
    icon: Building2,
    sub: "Green Recycling Facility",
  },
  { label: "Admin Demo", mobile: "7777777777", icon: Landmark, sub: "Ministry of Mines" },
];

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  const signIn = (value: string) => {
    const user = login(value);
    if (!user) {
      setError("Use a demo number: 9999999999, 8888888888 or 7777777777");
      return;
    }
    navigate({ to: homeForRole[user.role] });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Recycle className="size-5" />
            </span>
            <span className="font-semibold tracking-tight">Kabadiwala Connect</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your registered mobile number. No OTP needed in this prototype.
        </p>

        <form
          className="mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            signIn(mobile);
          }}
        >
          <label className="block text-sm font-medium" htmlFor="mobile">
            Mobile number
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3">
            <span className="text-sm text-muted-foreground">+91</span>
            <input
              id="mobile"
              inputMode="numeric"
              maxLength={10}
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value.replace(/\D/g, ""));
                setError("");
              }}
              placeholder="9999999999"
              className="w-full bg-transparent py-4 text-base outline-none"
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <button
            type="submit"
            className="w-full rounded-xl bg-primary py-4 text-base font-semibold text-primary-foreground"
          >
            Continue
          </button>
        </form>

        <div className="my-7 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or use a demo account{" "}
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-3">
          {demos.map((d) => (
            <button
              key={d.mobile}
              onClick={() => signIn(d.mobile)}
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-colors hover:bg-secondary"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <d.icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold">{d.label}</span>
                <span className="block text-xs text-muted-foreground">
                  {d.sub} · {d.mobile}
                </span>
              </span>
            </button>
          ))}
        </div>

        <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 text-primary" /> Demo environment — no real OTP or personal
          data is used.
        </p>
      </main>
    </div>
  );
}
