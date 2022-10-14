import nextPwa from 'next-pwa'
import transpileModules from 'next-transpile-modules'
import { withAxiom } from 'next-axiom'

// const withPwa = nextPwa({
//   dest: 'public',
// })
const withTranspileModules = transpileModules([
  '@sushiswap/redux-localstorage',
  '@sushiswap/wagmi',
  '@sushiswap/ui',
  '@sushiswap/graph-client',
])

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/analytics',
  reactStrictMode: true,
  swcMinify: false,
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/sushi-cdn/image/fetch/',
  },
  experimental: {
    nextScriptWorkers: true,
  },
  productionBrowserSourceMaps: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/analytics',
        permanent: true,
        basePath: false,
      },
      {
        source: '/analytics',
        has: [
          {
            type: 'host',
            value: 'analytics((-)+(arbitrum|avalanche|bsc|celo|ftm|fuse|harmony|moonriver|polygon|xdai))?.sushi.com',
          },
        ],
        destination: 'https://www.sushi.com/analytics',
        permanent: true,
        basePath: false,
      },
    ]
  },
}

// export default withAxiom(withPwa(withTranspileModules(nextConfig)))

export default withAxiom(withTranspileModules(nextConfig))
