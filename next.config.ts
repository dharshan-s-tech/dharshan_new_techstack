import type { NextConfig } from "next";

const apiRewriteTarget = (
  process.env.API_REWRITE_URL ||
  process.env.API_INTERNAL_URL ||
  "http://127.0.0.1:8000"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.1.6",
    "192.168.1.6:3333",
    "192.168.1.7",
    "192.168.1.7:3333",
    "10.10.182.76",
    "10.10.182.76:3333",
    "10.10.183.69",
    "10.10.183.69:3333",
    "10.10.183.39",
    "10.10.183.39:3333",
    "10.10.183.228",
    "10.10.183.228:3333",
    "13.202.245.81",
    "humbly-sanction-unblock.ngrok-free.dev",
    "*.ngrok-free.dev",
    "*.ngrok-free.app",
    "0.0.0.0",
  ],
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        {
          source: "/api/:path*",
          destination: `${apiRewriteTarget}/api/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
