import { HomeContent } from "@/components/home-content";
import { dictionaries } from "@/lib/i18n";

export default function LandingPage() {
  return <HomeContent dict={dictionaries.es} locale="es" />;
}
