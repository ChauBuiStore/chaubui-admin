import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https" as const,
        hostname: "**",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http" as const,
        hostname: "**",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
