import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静的ファイルの提供設定
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
