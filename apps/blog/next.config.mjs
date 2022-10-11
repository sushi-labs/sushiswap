import transpileModules from 'next-transpile-modules'
import { withAxiom } from 'next-axiom'

const withTranspileModules = transpileModules(['@sushiswap/ui'])

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/sushi-cdn/image/fetch/',
  },
  basePath: '/blog',
  reactStrictMode: true,
  swcMinify: false,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/blog',
        permanent: true,
        basePath: false,
      },
    ]
  },
}

export default withAxiom(withTranspileModules(nextConfig))
