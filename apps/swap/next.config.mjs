import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules([
  '@sushiswap/redux-token-lists',
  '@sushiswap/redux-localstorage',
  '@sushiswap/chain',
  '@sushiswap/wagmi',
  '@sushiswap/ui',
])

const date = new Date();
const GIT_COMMIT_SHA=`git rev-parse --verify HEAD`
const GIT_COMMIT_SHA_SHORT=`git rev-parse --short HEAD`
const NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA = typeof process.env.GIT_COMMIT_SHA === 'string' && process.env.GIT_COMMIT_SHA.substring(0, 8);


// @ts-check
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  basePath: '/swap',
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  httpAgentOptions: {
    keepAlive: false,
  },
 generateBuildId: async () => {
    return 'my-build-id'
  },
//  analyticsId: process.env.VERCEL_ANALYTICS_ID || '',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/sushi-cdn/image/fetch/',
  },
  experimental: {
    nextScriptWorkers: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [{ key: 'Web-Build', value: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA }]
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/swap',
        permanent: true,
        basePath: false,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'query',
            key: 'srcChainId',
          },
          {
            type: 'query',
            key: 'srcToken',
          },
          {
            type: 'query',
            key: 'srcTypedAmount',
          },
          {
            type: 'query',
            key: 'dstToken',
          },
          {
            type: 'query',
            key: 'dstChainId',
          },
        ],
        basePath: false,
        permanent: false,
        destination: '/xswap',
      },
    ]
  },
}

export default withTranspileModules(nextConfig)

console.log('process.env.VERCEL_GIT_COMMIT_SHA: ', process.env.GIT_COMMIT_SHA_SHORT);
console.log('process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: ', process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA);
console.log('next.config.mjs', JSON.stringify(module.exports, null, 2))
