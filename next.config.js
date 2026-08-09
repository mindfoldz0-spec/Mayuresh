/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'via.placeholder.com', 'raw.githubusercontent.com'],
  },
};

module.exports = nextConfig;
