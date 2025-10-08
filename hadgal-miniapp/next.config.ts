import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbo: {
    root: path.join(__dirname, "../../"),
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
