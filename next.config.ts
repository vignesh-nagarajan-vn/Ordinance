import type { NextConfig } from "next";

// Deployed on Vercel as a full Next.js app (with serverless API routes), so we
// no longer use static export / GitHub Pages basePath. The /api routes need a
// server runtime to proxy the Anthropic API and keep the key off the client.
const config: NextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default config;
