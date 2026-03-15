import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    // 開発環境では Next.js の画像最適化を無効にして URL を直接使用する。
    // localhost:8080 へのサーバーサイドプロキシを介さず、ブラウザが直接取得する。
    unoptimized: true,
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8080" },
      { protocol: "https", hostname: "*.auth0.com" },
      { protocol: "https", hostname: "*.gravatar.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
