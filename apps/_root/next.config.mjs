import transpileModules from 'next-transpile-modules'
import { withAxiom } from 'next-axiom'

const withTranspileModules = transpileModules([
  '@sushiswap/redux-token-lists',
  '@sushiswap/redux-localstorage',
  '@sushiswap/chain',
  '@sushiswap/wagmi',
  '@sushiswap/ui',
])

const {
  ROOT_URL,
  ANALYTICS_URL,
  BLOG_URL,
  BRIDGE_URL,
  EARN_URL,
  FURO_URL,
  INTERNAL_URL,
  KASHI_URL,
  PARTNER_URL,
  SWAP_URL,
  XSWAP_URL,
} = process.env

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/sushi-cdn/image/fetch/',
  },
  productionBrowserSourceMaps: true,
  async redirects() {
    return [
      {
        source: '/discord{/}?',
        permanent: true,
        destination: 'https://discord.gg/SDPH8SNVZW',
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
    ]
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: `/:path*`,
      },
      {
        source: '/analytics',
        destination: `${ANALYTICS_URL}/analytics`,
      },
      {
        source: '/analytics/:path*',
        destination: `${ANALYTICS_URL}/analytics/:path*`,
      },
      {
        source: '/blog',
        destination: `${BLOG_URL}/blog`,
      },
      {
        source: '/blog/:path*',
        destination: `${BLOG_URL}/blog/:path*`,
      },
      {
        source: '/furo',
        destination: `${FURO_URL}/furo`,
      },
      {
        source: '/furo/:path*',
        destination: `${FURO_URL}/furo/:path*`,
      },
      {
        source: '/partner',
        destination: `${PARTNER_URL}/partner`,
      },
      {
        source: '/partner/:path*',
        destination: `${PARTNER_URL}/partner/:path*`,
      },
      {
        source: '/swap',
        destination: `${SWAP_URL}/swap`,
      },
      {
        source: '/swap/:path*',
        destination: `${SWAP_URL}/swap/:path*`,
      },
      {
        source: '/xswap',
        destination: `${XSWAP_URL}/xswap`,
      },
      {
        source: '/xswap/:path*',
        destination: `${XSWAP_URL}/xswap/:path*`,
      },
      {
        source: '/invest',
        destination: `${EARN_URL}/earn`,
      },
      {
        source: '/invest/:path*',
        destination: `${EARN_URL}/earn/:path*`,
      },
      {
        source: '/earn',
        destination: `${EARN_URL}/earn`,
      },
      {
        source: '/earn/:path*',
        destination: `${EARN_URL}/earn/:path*`,
      },
    ]
  },
}

export default withAxiom(withTranspileModules(nextConfig))
