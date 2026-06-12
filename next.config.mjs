/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This turns off the dev overlay screen for false-positive warnings
  devIndicators: {
    appIsrStatus: false,
  },
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
};

export default nextConfig;
