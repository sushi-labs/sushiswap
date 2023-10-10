import defaultNextConfig from '@sushiswap/nextjs-config'

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...defaultNextConfig,
  basePath: '/furo',
  transpilePackages: ['@sushiswap/wagmi'],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/furo',
        permanent: true,
        basePath: false,
      },
    ]
  },
}

export default nextConfig
