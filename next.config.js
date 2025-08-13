/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },

  // Removed invalid experimental props
  // Fonts should now be handled with `next/font` imports directly in your code
};

module.exports = nextConfig;
