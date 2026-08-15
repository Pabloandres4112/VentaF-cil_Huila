import Link from "next/link";
import type { ReactNode } from "react";
import { localePaths } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  return (
    <div className="flex items-center gap-1 text-sm font-bold">
      <LangLink target="es" current={locale}>
        ES
      </LangLink>
      <span className="text-ink-faint">/</span>
      <LangLink target="en" current={locale}>
        EN
      </LangLink>
    </div>
  );
}

function LangLink({
  target,
  current,
  children,
}: {
  target: Locale;
  current: Locale;
  children: ReactNode;
}) {
  const active = target === current;
  return (
    <Link
      href={localePaths[target]}
      aria-current={active ? "page" : undefined}
      className={`rounded px-1.5 py-1 transition-colors ${
        active ? "text-ink" : "text-ink-faint hover:text-ink-soft"
      }`}
    >
      {children}
    </Link>
  );
}
