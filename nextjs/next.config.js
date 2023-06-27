/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
    eslint: {
      ignoreDuringBuilds: true,
    },
  images: {
    domains: ["ipfs.infura.io"],
  },
}

module.exports = nextConfig
