import type { Metadata } from "next";
import { HomeContent } from "@/components/home-content";
import { dictionaries } from "@/lib/i18n";

export const metadata: Metadata = {
  title: dictionaries.en.meta.title,
  description: dictionaries.en.meta.description,
};

export default function LandingPageEn() {
  return <HomeContent dict={dictionaries.en} locale="en" />;
}
