"use client";

// El layout raíz fija lang="es" para toda la app; en las páginas en otro
// idioma (hoy solo /en) esto corrige el idioma que anuncian los lectores de
// pantalla y que usa el navegador para traducir.

import { useEffect } from "react";

export function SetHtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    const previo = document.documentElement.lang;
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = previo;
    };
  }, [lang]);

  return null;
}
