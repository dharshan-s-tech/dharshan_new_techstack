import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "10.10.183.228",
    "0.0.0.0",
    "*"
  ]
};

export default nextConfig;
