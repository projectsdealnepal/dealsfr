import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.100.133",
        pathname: "/**",
      },
    ],
  }
};

export default nextConfig;
