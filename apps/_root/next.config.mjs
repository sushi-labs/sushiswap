import defaultNextConfig from '@sushiswap/nextjs-config'
import { withAxiom } from 'next-axiom'

const { ANALYTICS_URL, BLOG_URL, EARN_URL, FURO_URL, SWAP_URL, ACADEMY_URL } = process.env

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...defaultNextConfig,
  transpilePackages: ['@sushiswap/ui', '@sushiswap/wagmi'],
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
        source: '/academy',
        destination: `${ACADEMY_URL}/academy`,
      },
      {
        source: '/academy/:path*',
        destination: `${ACADEMY_URL}/academy/:path*`,
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
      // {
      //   source: '/swap',
      //   destination: `${SWAP_URL}/swap`,
      // },
      // {
      //   source: '/swap/:path*',
      //   destination: `${SWAP_URL}/swap/:path*`,
      // },
      // {
      //   source: '/xswap',
      //   destination: '/swap',
      // },
      // {
      //   source: '/xswap/:path*',
      //   destination: '/swap/:path*',
      // },
      {
        source: '/earn',
        destination: `/pool`,
      },
      {
        source: '/earn/:path*',
        destination: `/pool/:path*`,
      },
      {
        source: '/pools',
        destination: `/pool`,
      },
      {
        source: '/pools/:path*',
        destination: `/pool/:path*`,
      },
    ]
  },
}

export default withAxiom(nextConfig)
