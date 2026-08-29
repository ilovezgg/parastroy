import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/catalog/blok-konteynery",
        destination: "/catalog/blok-konteinery",
        permanent: true,
      },
      {
        source: "/catalog/blok-konteynery/:path*",
        destination: "/catalog/blok-konteinery/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
