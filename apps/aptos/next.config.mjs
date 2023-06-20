import defaultNextConfig from '@sushiswap/nextjs-config'

import { withAxiom } from 'next-axiom'

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...defaultNextConfig,
  transpilePackages: ['@sushiswap/ui'],
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
