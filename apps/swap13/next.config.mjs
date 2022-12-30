// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/swap13',
  reactStrictMode: true,
  swcMinify: false,
  productionBrowserSourceMaps: true,
  poweredByHeader: false,
  experimental: {
    appDir: true,
    esmExternals: 'loose',
    transpilePackages: [
      '@sushiswap/redux-token-lists',
      '@sushiswap/redux-localstorage',
      '@sushiswap/ui13',
      '@sushiswap/wagmi13',
    ],
  },
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/sushi-cdn/image/fetch/',
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

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
export default nextConfig
