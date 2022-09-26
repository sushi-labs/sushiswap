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

  source: '/:path((?!another-page$).*)',
  has: [
    {
      type: 'host',
      value: 'example.com',
    },
  ],
  permanent: false,
  destination: '/another-page',
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'analytics-fuse.sushi.com',
          },
        ],
        destination: '/analytics',
        permanent: true,
        statusCode: 308,
        basePath: false,
      },
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'sushi.com',
          },
        ],
        destination: '/analytics',
        permanent: true,
        basePath: false,
      },
    ]
  },
}

export default withTranspileModules(nextConfig)
