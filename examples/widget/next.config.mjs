import { withAxiom } from 'next-axiom'
import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['@sushiswap/wagmi', '@sushiswap/ui'])

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/widget',
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
        source: '/',
        destination: '/widget',
        permanent: true,
        basePath: false,
      },
    ]
  },
}

export default withAxiom(withTranspileModules(nextConfig))
