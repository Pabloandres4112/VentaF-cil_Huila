import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: "VentaFácil Huila",
  description: "Catálogo digital e inventario para micronegocios, con pedidos directos a WhatsApp.",
};

const THEME_INIT_SCRIPT = `
  try {
    var t = localStorage.getItem('ventafacil-theme');
    if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
  } catch (e) {}
`;

// lang="es" queda fijo porque el layout raíz es único para toda la app y el
// multi-idioma por ahora solo cubre la Home (/ y /en). Cuando el resto del
// sitio se traduzca, esto debe pasar a un layout por locale.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${archivo.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
        {children}
      </body>
    </html>
  );
}
