import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Solo afecta a `next dev`: deja probar desde el celular por la IP de la
  // red local (si no, Next bloquea el JavaScript y la página no reacciona).
  allowedDevOrigins: ["192.168.100.11"],
};

export default nextConfig;
