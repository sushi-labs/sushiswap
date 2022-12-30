import defaultNextConfig from '@sushiswap/nextjs-config'

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...defaultNextConfig,
  basePath: '/academy',
  transpilePackages: ['@sushiswap/ui'],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/academy',
        permanent: true,
        basePath: false,
      },
    ]
  },
}

export default nextConfig
