import { es } from "./es";
import { en } from "./en";
import type { HomeDict, Locale } from "./types";

export const locales: Locale[] = ["es", "en"];

export const dictionaries: Record<Locale, HomeDict> = { es, en };

export const localePaths: Record<Locale, string> = { es: "/", en: "/en" };

export type { HomeDict, Locale };
