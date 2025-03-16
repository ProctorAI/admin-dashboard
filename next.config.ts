import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "**",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
