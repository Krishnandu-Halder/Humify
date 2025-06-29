/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003',
  },
  // Force Next.js to use port 3000
  devIndicators: {
    buildActivity: true,
  },
};

export default nextConfig;
