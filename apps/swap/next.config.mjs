/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/swap',
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  swcMinify: false,
  poweredByHeader: false,
  staticPageGenerationTimeout: 180,
  experimental: {
    esmExternals: 'loose',
  },
  transpilePackages: [
    '@sushiswap/redux-token-lists',
    '@sushiswap/redux-localstorage',
    '@sushiswap/wagmi',
    '@sushiswap/ui',
  ],
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/sushi-cdn/image/fetch/',
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

export default nextConfig
// export default withTranspileModules(nextConfig)
