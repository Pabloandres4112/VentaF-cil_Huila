import type { Metadata } from "next";
import { HomeContent } from "@/components/home-content";
import { SetHtmlLang } from "@/components/set-html-lang";
import { dictionaries } from "@/lib/i18n";

export const metadata: Metadata = {
  title: dictionaries.en.meta.title,
  description: dictionaries.en.meta.description,
};

export default function LandingPageEn() {
  return (
    <>
      <SetHtmlLang lang="en" />
      <HomeContent dict={dictionaries.en} locale="en" />
    </>
  );
}
