import defaultNextConfig from '@sushiswap/nextjs-config'

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...defaultNextConfig,
  basePath: '/swap13',
  eslint: {
    dirs: ['pages', 'components', 'lib', 'app', 'swap', 'ui'], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
  },
  transpilePackages: [
    '@sushiswap/redux-token-lists',
    '@sushiswap/redux-localstorage',
    '@sushiswap/ui13',
    '@sushiswap/wagmi13',
  ],
  experimental: {
    appDir: true,
    esmExternals: 'loose',
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/swap13',
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

export default nextConfig
