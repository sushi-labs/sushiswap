/** @type {import('next').NextConfig} */
const defaultNextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  swcMinify: false,
  poweredByHeader: false,
  staticPageGenerationTimeout: 180,
  modularizeImports: {
    '@heroicons/react/solid': {
      transform: '@heroicons/react/solid/{{member}}',
    },
    '@heroicons-v1/react/solid': {
      transform: '@heroicons-v1/react/solid/{{member}}',
    },
    '@heroicons/react/outline': {
      transform: '@heroicons/react/outline/{{member}}',
    },
    '@heroicons-v1/react/outline': {
      transform: '@heroicons-v1/react/outline/{{member}}',
    },
    lodash: {
      transform: 'lodash/{{member}}',
    },
  },
  experimental: {
    esmExternals: 'loose',
  },
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/sushi-cdn/image/fetch/',
    domains: ['https://cdn.sushi.com/'],
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
