/** @type {import('next').NextConfig} */
const defaultNextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  swcMinify: true,
  poweredByHeader: false,
  staticPageGenerationTimeout: 180,
  experimental: {
    optimizePackageImports: [
      '@heroicons-v1/react/20/solid',
      '@heroicons-v1/react/24/solid',
      '@heroicons-v1/react/24/outline',
      "@sushiswap/client",
      "@sushiswap/dexie",
      "@sushiswap/hooks",
      "@sushiswap/react-query",
      "@sushiswap/ui",
      "@sushiswap/wagmi",
      "d3",
      "date-fns",
      "echarts",
      "echarts-for-react",
      "sushi"
    ]
  },
  experimental: {
    esmExternals: 'loose',
  },
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/sushi-cdn/image/fetch/',
    domains: ['cdn.sushi.com'],
  },
  eslint: {
    dirs: [
      // ...
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
  webpack: (config, { isServer }) => {
    // If client-side, don't polyfill `fs`
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        dns: false,
        tls: false,
        net: false,
      }
    }

    config.module = {
      ...config.module,
      exprContextCritical: false,
    }

    return config
  },
}

module.exports = defaultNextConfig
