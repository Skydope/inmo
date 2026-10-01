import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
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
