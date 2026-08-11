/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  basePath: isProd ? '/Mayuresh' : '',
  assetPrefix: isProd ? '/Mayuresh/' : '',
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'via.placeholder.com', 'raw.githubusercontent.com'],
  },
};

module.exports = nextConfig;
