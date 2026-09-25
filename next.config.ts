import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Solo afecta a `next dev`: deja probar desde el celular por la IP de la
  // red local (si no, Next bloquea el JavaScript y la página no reacciona).
  allowedDevOrigins: ["192.168.100.11"],
  // Cabeceras de seguridad básicas. No se define Content-Security-Policy a
  // propósito: Next inyecta scripts en línea y una CSP mal hecha rompería la
  // app; conviene añadirla aparte, con nonces, y probándola.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
        ],
      },
    ];
  },
};

export default nextConfig;
