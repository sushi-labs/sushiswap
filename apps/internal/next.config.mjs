import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['@sushiswap/redux-token-lists', '@sushiswap/ui'])

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/internal',
  reactStrictMode: true,
  swcMinify: false,
  productionBrowserSourceMaps: true,
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/sushi-cdn/image/fetch/',
  },
  experimental: {
    esmExternals: 'loose',
  },
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

export default withTranspileModules(nextConfig)
