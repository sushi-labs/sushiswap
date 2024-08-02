import { withSentryConfig } from '@sentry/nextjs'
import defaultNextConfig from '@sushiswap/nextjs-config'
import { withAxiom } from 'next-axiom'

import withBundleAnalyzer from '@next/bundle-analyzer'
const bundleAnalyzer = withBundleAnalyzer({
  enabled: false && process.env.NODE_ENV !== 'development',
})

const FURO_URL = 'https://furo.sushi.com'

/** @type {import('next').NextConfig} */
const nextConfig = bundleAnalyzer({
  ...defaultNextConfig,
  experimental: {
    ...defaultNextConfig.experimental,
    testProxy: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        permanent: true,
        destination: '/swap',
      },
      {
        source: '/discord{/}?',
        permanent: true,
        destination: 'https://discord.gg/ej78AWjy6Y',
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
      {
        source: '/skale/swap',
        permanent: true,
        destination: '/swap?chainId=2046399126',
      },
    ]
  },
  async rewrites() {
    return [
      // if the host is `aptos.sushi.com`,
      // this rewrite will be applied
      // {
      //   source: '/:path*',
      //   has: [
      //     {
      //       type: 'host',
      //       value: 'aptos.sushi.com',
      //     },
      //   ],
      //   destination: '/aptos/:path*',
      // },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'test.sushi.com',
          },
        ],
        destination: '/test/:path*',
      },
      // {
      //   source: '/:path*',
      //   has: [
      //     {
      //       type: 'host',
      //       value: 'pay.sushi.com',
      //     },
      //   ],
      //   destination: '/pay/:path*',
      // },
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
})

export default withSentryConfig(withAxiom(nextConfig), {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: 'sushi-j9',
  project: 'evm',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
})
