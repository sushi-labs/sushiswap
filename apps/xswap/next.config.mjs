import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules([
  '@sushiswap/redux-token-lists',
  '@sushiswap/redux-localstorage',
  '@sushiswap/chain',
  '@sushiswap/wagmi',
  '@sushiswap/stargate',
  '@sushiswap/ui',
  '@sushiswap/swap-widget',
])

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/xswap',
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
        destination: '/xswap',
        permanent: true,
        basePath: false,
      },
    ]
  },
}

export default withTranspileModules(nextConfig)
