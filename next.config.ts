import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/receipts/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.3',
        port: '3000',
        pathname: '/uploads/receipts/**',
      },
    ],
  }
};

export default nextConfig;
