import withBundleAnalyzer from '@next/bundle-analyzer'
import defaultNextConfig from '@sushiswap/nextjs-config'

const bundleAnalyzer = withBundleAnalyzer({
  enabled: false && process.env.NODE_ENV !== 'development',
})

/** @type {import('next').NextConfig} */
const nextConfig = bundleAnalyzer({
  ...defaultNextConfig,
  images: {
    ...defaultNextConfig.images,
    remotePatterns: [
      // Support Sushi's Cloudinary CDN
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/sushi-cdn/image/*',
      },
    ],
  },
  experimental: {
    ...defaultNextConfig.experimental,
    testProxy: process.env.NEXT_PUBLIC_APP_ENV === 'test',
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
        source: '/stellar',
        permanent: true,
        destination: '/stellar/swap',
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
        source: '/swap/cross-chain:path*',
        permanent: true,
        destination: '/cross-chain-swap:path*',
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
