import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  // Orígenes desde los que el dev server sirve sus recursos (HMR, hidratación). Sin esto, al
  // levantarlo con --hostname 0.0.0.0 el JS no hidrata y no hay error a la vista: desde el
  // celu por la IP de la LAN, y desde 127.0.0.1 (lo usan los e2e y las capturas).
  allowedDevOrigins: ["192.168.*.*", "127.0.0.1"],
  images: {
    // AVIF primero: la casa del hero del inicio es el LCP y pesa la mitad que en WebP.
    formats: ["image/avif", "image/webp"],
    // Next 16 exige declarar las calidades. 55: la casa del hero (una foto grande, sin texto
    // chico encima); 75: el resto.
    qualities: [55, 75],
  },
  async headers() {
    return [
      {
        source: "/maplibre/:path*",
        headers: [{ key: "Content-Type", value: "text/javascript" }],
      },
    ]
  },
};

export default nextConfig;
