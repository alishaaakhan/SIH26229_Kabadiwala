import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "hi" | "mr";

export const languages: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
];

const en = {
  dashboard: "Dashboard",
  createLot: "Create Lot",
  myLots: "My Lots",
  material: "Material",
  weight: "Weight",
  price: "Price",
  recycler: "Recycler",
  pickup: "Pickup",
  payment: "Payment",
  earnings: "Earnings",
  transactions: "Transactions",
  notifications: "Notifications",
  safety: "Safety",
  prices: "Prices",
  findRecycler: "Find Recycler",
  profile: "Profile",
  sell: "Sell E-Waste",
  online: "Online",
  offline: "Offline",
  syncNow: "Sync Now",
  pendingSync: "Pending Sync",
  synced: "Synced",
  syncFailed: "Sync Failed",
  todaysEarnings: "Today's Earnings",
  activeLots: "Active Lots",
  pendingPayment: "Pending Payment",
  totalEarnings: "Total Earnings",
  impact: "Environmental Impact",
  language: "Language",
};

type Dict = typeof en;
export type TKey = keyof Dict;

const hi: Dict = {
  dashboard: "डैशबोर्ड",
  createLot: "लॉट बनाएं",
  myLots: "मेरे लॉट",
  material: "सामग्री",
  weight: "वज़न",
  price: "कीमत",
  recycler: "रीसाइक्लर",
  pickup: "पिकअप",
  payment: "भुगतान",
  earnings: "कमाई",
  transactions: "लेन-देन",
  notifications: "सूचनाएं",
  safety: "सुरक्षा",
  prices: "आज के भाव",
  findRecycler: "रीसाइक्लर खोजें",
  profile: "प्रोफ़ाइल",
  sell: "ई-कचरा बेचें",
  online: "ऑनलाइन",
  offline: "ऑफ़लाइन",
  syncNow: "अभी सिंक करें",
  pendingSync: "सिंक बाकी",
  synced: "सिंक हो गया",
  syncFailed: "सिंक विफल",
  todaysEarnings: "आज की कमाई",
  activeLots: "चालू लॉट",
  pendingPayment: "बाकी भुगतान",
  totalEarnings: "कुल कमाई",
  impact: "पर्यावरण प्रभाव",
  language: "भाषा",
};

const mr: Dict = {
  dashboard: "डॅशबोर्ड",
  createLot: "लॉट तयार करा",
  myLots: "माझे लॉट",
  material: "साहित्य",
  weight: "वजन",
  price: "किंमत",
  recycler: "रिसायकलर",
  pickup: "पिकअप",
  payment: "पेमेंट",
  earnings: "कमाई",
  transactions: "व्यवहार",
  notifications: "सूचना",
  safety: "सुरक्षा",
  prices: "आजचे दर",
  findRecycler: "रिसायकलर शोधा",
  profile: "प्रोफाइल",
  sell: "ई-कचरा विका",
  online: "ऑनलाइन",
  offline: "ऑफलाइन",
  syncNow: "आता सिंक करा",
  pendingSync: "सिंक बाकी",
  synced: "सिंक झाले",
  syncFailed: "सिंक अयशस्वी",
  todaysEarnings: "आजची कमाई",
  activeLots: "सुरू लॉट",
  pendingPayment: "बाकी पेमेंट",
  totalEarnings: "एकूण कमाई",
  impact: "पर्यावरणीय परिणाम",
  language: "भाषा",
};

const dicts: Record<Lang, Dict> = { en, hi, mr };

const KEY = "kc.lang";

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TKey) => string;
}

const I18nContext = createContext<I18nValue>({ lang: "en", setLang: () => {}, t: (k) => en[k] });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY) as Lang | null;
      if (saved && saved in dicts) setLangState(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<I18nValue>(
    () => ({ lang, setLang, t: (key) => dicts[lang][key] ?? en[key] }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
