import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.1.6",
    "192.168.1.6:3333",
    "192.168.1.7",
    "192.168.1.7:3333",
    "10.10.183.228",
    "13.202.245.81",
    "humbly-sanction-unblock.ngrok-free.dev",
    "*.ngrok-free.dev",
    "*.ngrok-free.app",
    "0.0.0.0",
  ],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
