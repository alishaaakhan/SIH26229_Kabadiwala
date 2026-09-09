import { Languages } from "lucide-react";
import { languages, useI18n, type Lang } from "@/lib/i18n";

export function LanguageSelect() {
  const { lang, setLang } = useI18n();
  return (
    <label className="relative inline-flex items-center">
      <Languages className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground" />
      <span className="sr-only">Language</span>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        className="appearance-none rounded-xl border border-border bg-card py-2 pl-8 pr-3 text-xs font-medium"
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
