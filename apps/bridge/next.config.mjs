import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules([
  '@sushiswap/redux-token-lists',
  '@sushiswap/redux-localstorage',
  '@sushiswap/wagmi',
  '@sushiswap/ui',
])

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/bridge',
  reactStrictMode: true,
  swcMinify: false,
  productionBrowserSourceMaps: true,
  poweredByHeader: false,
  experimental: {
    esmExternals: 'loose',
  },
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/sushi-cdn/image/fetch/',
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/bridge',
        permanent: true,
        basePath: false,
      },
    ]
  },
}

export default withTranspileModules(nextConfig)
