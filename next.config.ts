import type { NextConfig } from "next";
const config: NextConfig = {
  images: { remotePatterns: [{ protocol:"https", hostname:"*.vercel-storage.com" }] },
};
export default config;
