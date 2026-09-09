import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Role } from "./demo-data";

export interface SessionUser {
  role: Role;
  name: string;
  mobile: string;
  org?: string;
  id: string;
}

export const demoAccounts: Record<string, SessionUser> = {
  "9999999999": {
    role: "collector",
    name: "Ramesh Kumar",
    mobile: "9999999999",
    id: "C-101",
  },
  "8888888888": {
    role: "recycler",
    name: "Anil Joshi",
    mobile: "8888888888",
    org: "Green Recycling Facility",
    id: "R-201",
  },
  "7777777777": {
    role: "admin",
    name: "Ministry of Mines",
    mobile: "7777777777",
    org: "Government Monitoring Cell",
    id: "A-001",
  },
};

export const homeForRole: Record<Role, string> = {
  collector: "/collector",
  recycler: "/recycler",
  admin: "/admin",
};

interface AuthValue {
  user: SessionUser | null;
  ready: boolean;
  login: (mobile: string) => SessionUser | null;
  logout: () => void;
}

const AuthContext = createContext<AuthValue>({
  user: null,
  ready: false,
  login: () => null,
  logout: () => {},
});

const KEY = "kc.session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw) as SessionUser);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      ready,
      login: (mobile: string) => {
        const account = demoAccounts[mobile.trim()];
        if (!account) return null;
        localStorage.setItem(KEY, JSON.stringify(account));
        setUser(account);
        return account;
      },
      logout: () => {
        localStorage.removeItem(KEY);
        setUser(null);
      },
    }),
    [user, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
