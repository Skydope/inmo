import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  // Permite HMR al abrir el dev server desde el celu por IP de la LAN
  allowedDevOrigins: ["192.168.*.*"],
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
