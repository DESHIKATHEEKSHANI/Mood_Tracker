/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    fontLoaders: [
      {
        loader: 'next/font',
        options: {
          timeout: 20000 // Increased timeout to 20 seconds
        }
      }
    ],
    cache: false // Disable webpack file system cache
  }
};

module.exports = nextConfig;