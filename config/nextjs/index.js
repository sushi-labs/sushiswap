/** @type {import('next').NextConfig} */
const defaultNextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  swcMinify: true,
  poweredByHeader: false,
  staticPageGenerationTimeout: 180,
  experimental: {
    esmExternals: 'loose',
    // Prepare for Next.js 13.5.4+
    // optimizePackageImports: [
    //   '@heroicons/react-v1/solid',
    //   '@heroicons/react-v1/outline',
    //   '@sushiswap/client',
    //   '@sushiswap/database',
    //   '@sushiswap/dexie',
    //   '@sushiswap/graph-client',
    //   '@sushiswap/hooks',
    //   '@sushiswap/react-query',
    //   '@sushiswap/router',
    //   '@sushiswap/tines',
    //   '@sushiswap/ui',
    //   'sushi',
    // ],
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
