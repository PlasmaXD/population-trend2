import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};
module.exports = {
  env: {
    RESAS_API_KEY: process.env.RESAS_API_KEY,
  },
};
export default nextConfig;
