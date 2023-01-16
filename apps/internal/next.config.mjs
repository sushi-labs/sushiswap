import defaultNextConfig from '@sushiswap/nextjs-config'

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...defaultNextConfig,
  basePath: '/internal',
  transpilePackages: ['@sushiswap/redux-token-lists', '@sushiswap/ui'],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/internal',
        permanent: true,
        basePath: false,
      },
    ]
  },
}

export default nextConfig
