import nextPwa from 'next-pwa'
import transpileModules from 'next-transpile-modules'

const withPwa = nextPwa({
  dest: 'public',
})
const withTranspileModules = transpileModules([
  '@sushiswap/redux-localstorage',
  '@sushiswap/wagmi',
  '@sushiswap/ui',
  '@sushiswap/graph-client',
])

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/analytics',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/sushi-cdn/image/fetch/',
  },
  experimental: {
    nextScriptWorkers: true,
  },
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

export default withPwa(withTranspileModules(nextConfig))
