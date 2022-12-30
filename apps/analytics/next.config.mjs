import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['@sushiswap/redux-localstorage', '@sushiswap/wagmi', '@sushiswap/ui'])

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/analytics',
  reactStrictMode: true,
  swcMinify: false,
  experimental: {
    esmExternals: 'loose',
  },
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/sushi-cdn/image/fetch/',
  },
  productionBrowserSourceMaps: true,
  staticPageGenerationTimeout: 180,
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

export default withTranspileModules(nextConfig)
