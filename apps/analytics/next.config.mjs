import defaultNextConfig from '@sushiswap/nextjs-config'

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...defaultNextConfig,
  basePath: '/analytics',
  transpilePackages: ['@sushiswap/redux-localstorage', '@sushiswap/wagmi', '@sushiswap/ui'],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/analytics',
        permanent: true,
        basePath: false,
      },
      {
        source: '/analytics',
        has: [
          {
            type: 'host',
            value: 'analytics((-)+(arbitrum|avalanche|bsc|celo|ftm|fuse|harmony|moonriver|polygon|xdai))?.sushi.com',
          },
        ],
        destination: 'https://www.sushi.com/analytics',
        permanent: true,
        basePath: false,
      },
    ]
  },
}

export default nextConfig
