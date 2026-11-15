import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Matikan Turbopack — gunakan webpack (lebih stabil)
  experimental: {},
};

export default nextConfig;
