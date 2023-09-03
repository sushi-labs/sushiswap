const { withSentryConfig } = require('@sentry/nextjs')
const defaultNextConfig = require('@sushiswap/nextjs-config')
const { withAxiom } = require('next-axiom')

const ACADEMY_URL = process.env.ACADEMY_URL || 'https://academy.sushi.com'
const BLOG_URL = process.env.BLOG_URL || 'https://blog.sushi.com'
const FURO_URL = process.env.ACADEMY_URL || 'https://furo.sushi.com'

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
      {
        source: '/earn/:path*',
        permanent: true,
        destination: '/pool/:path*',
      },
      {
        source: '/pools/:path*',
        permanent: true,
        destination: '/pool/:path*',
      },
      {
        source: '/pool/:path*/positions',
        permanent: true,
        destination: '/pool/:path*',
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
    ]
  },
}

module.exports = withSentryConfig(
  withAxiom(nextConfig),
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,

    org: 'sushi-j9',
    project: 'evm',
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: '/monitoring',

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  }
)
