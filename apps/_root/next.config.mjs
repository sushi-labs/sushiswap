import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['@sushiswap/ui', '@sushiswap/chain'])

const {
  BLOG_URL,
  ANALYTICS_URL,
  DAO_URL,
  DOCS_URL,
  FURO_URL,
  LANDING_URL,
  SWAP_URL,
  XSWAP_URL,
  INVEST_URL,
  LEGACY_URL,
  PARTNER_URL,
} = process.env

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/sushi-cdn/image/fetch/',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
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
        destination: `${INVEST_URL}/earn`,
      },
      {
        source: '/invest/:path*',
        destination: `${INVEST_URL}/earn/:path*`,
      },
      {
        source: '/earn',
        destination: `${INVEST_URL}/earn`,
      },
      {
        source: '/earn/:path*',
        destination: `${INVEST_URL}/earn/:path*`,
      },
    ]
  },
}

export default withTranspileModules(nextConfig)
