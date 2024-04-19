import defaultNextConfig from '@sushiswap/nextjs-config'

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...defaultNextConfig,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  transpilePackages: [],
  async redirects() {
    return []
  },
  async rewrites() {
    return []
  },
}

export default nextConfig
