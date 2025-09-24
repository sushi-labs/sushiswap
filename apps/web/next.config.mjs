import withBundleAnalyzer from '@next/bundle-analyzer'

const bundleAnalyzer = withBundleAnalyzer({
  enabled: false && process.env.NODE_ENV !== 'development',
})

/** @type {import('next').NextConfig} */
const nextConfig = bundleAnalyzer({
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  poweredByHeader: false,
  staticPageGenerationTimeout: 180,
  turbopack: {},
  experimental: {
    webpackBuildWorker: true,
    optimizePackageImports: [
      '@heroicons/react-v1/solid',
      '@heroicons/react-v1/outline',
      '@sushiswap/graph-client',
      '@sushiswap/hooks',
      '@sushiswap/ui',
      'sushi',
      'date-fns',
    ],
    testProxy: process.env.NEXT_PUBLIC_APP_ENV === 'test',
  },
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/sushi-cdn/image/fetch/',
    domains: ['cdn.sushi.com', 'static.tronscan.org'],
  },
  eslint: {
    dirs: [
      'app',
      'components',
      'functions',
      'lib',
      'pages',
      'providers',
      'types',
      'ui',
    ],
  },
  webpack: (config, { webpack }) => {
    if (config.plugins) {
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^(lokijs|pino-pretty|encoding)$/,
        }),
      )
    }
    // Ignore import trace warnings from graphclient & sentry
    config.ignoreWarnings = [
      {
        module: /node_modules\/@graphql-mesh\/utils\/esm\/defaultImportFn\.js/,
      },
      { file: /node_modules\/@graphql-mesh\/utils\/esm\/defaultImportFn\.js/ },
      {
        module: /node_modules\/@sentry\/utils\/esm\/index\.js/,
      },
      { file: /node_modules\/@sentry\/utils\/esm\/index\.js/ },
      {
        module: /node_modules\/@sentry\/utils\/esm\/isBrowser\.js/,
      },
      { file: /node_modules\/@sentry\/utils\/esm\/isBrowser\.js/ },
      {
        module: /node_modules\/@whatwg-node\/fetch\/dist\/node-ponyfill\.js/,
      },
      { file: /node_modules\/@whatwg-node\/fetch\/dist\/node-ponyfill\.js/ },
    ]
    return config
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'test.sushi.com',
          },
        ],
        destination: 'https://sushi.com/test/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'aptos.sushi.com',
          },
        ],
        destination: 'https://sushi.com/aptos/:path*',
        permanent: true,
      },
      {
        source: '/aptos',
        permanent: true,
        destination: '/aptos/swap',
      },
      {
        source: '/tron',
        permanent: true,
        destination: '/tron/swap',
      },
      {
        source: '/',
        permanent: true,
        destination: '/swap',
      },
      {
        source: '/discord{/}?',
        permanent: true,
        destination: 'https://discord.gg/qGeREffeAH',
      },
      {
        source: '/github{/}?',
        permanent: true,
        destination: 'https://github.com/sushiswap',
      },
      {
        source: '/twitter{/}?',
        permanent: true,
        destination: 'https://twitter.com/sushiswap',
      },
      {
        source: '/instagram{/}?',
        permanent: true,
        destination: 'https://instagram.com/instasushiswap',
      },
      {
        source: '/medium{/}?',
        permanent: true,
        destination: 'https://medium.com/sushiswap-org',
      },
      {
        source: '/swap/cross-chain/:path*',
        permanent: true,
        destination: '/cross-chain-swap/:path*',
      },
      {
        source: '/skale',
        permanent: true,
        destination: '/skale-europa/explore/pools',
      },
    ]
  },
  async rewrites() {
    return []
  },
})

export default nextConfig
