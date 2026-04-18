import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "img.drz.lazcdn.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "satechi.com" },
      { protocol: "https", hostname: "www.figureout3d.com" },
      { protocol: "https", hostname: "store.yeelight.com" },
    ],
  },
};

export default nextConfig;
