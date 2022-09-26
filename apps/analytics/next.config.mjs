import transpileModules from 'next-transpile-modules'

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
        source: '/',
        has: [
          {
            type: 'host',
            value: 'analytics-fuse.sushi.com',
          },
        ],
        destination: `/analytics`,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'analytics-fuse.sushi.com',
          },
        ],
        destination: `/analytics/:path*`,
      },
    ]
  },
}

export default withTranspileModules(nextConfig)
