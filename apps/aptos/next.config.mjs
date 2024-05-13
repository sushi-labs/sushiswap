import defaultNextConfig from '@sushiswap/nextjs-config'

import { withAxiom } from 'next-axiom'

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...defaultNextConfig,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  async redirects() {
    return [
      {
        source: '/',
        permanent: true,
        destination: '/swap',
      },
    ]
  },
}

export default withAxiom(nextConfig)
