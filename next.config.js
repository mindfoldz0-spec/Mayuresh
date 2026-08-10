/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS || false;

let repo = '';
if (isGithubActions) {
  const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY || '';
  repo = GITHUB_REPOSITORY.replace(/.*?\//, '');
}

const basePath = isGithubActions && repo ? `/${repo}` : '';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : '',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

module.exports = nextConfig;
