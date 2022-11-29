import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules([
  '@sushiswap/redux-localstorage',
  '@sushiswap/redux-token-lists',
  '@sushiswap/ui',
  '@sushiswap/wagmi',
])

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/furo',
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

export default withTranspileModules(nextConfig)
