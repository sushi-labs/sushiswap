/** @type {import('next').NextConfig} */
const defaultNextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  // swcMinify: false,
  poweredByHeader: false,
  staticPageGenerationTimeout: 180,
  experimental: {
    esmExternals: 'loose',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/sushi-cdn/**',
      },
    ],
    loader: 'cloudinary',
    // path: 'https://cdn.sushi.com/image/fetch/',
    path: 'https://res.cloudinary.com/sushi-cdn/image/fetch/',
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

    return config
  },
}

module.exports = defaultNextConfig
