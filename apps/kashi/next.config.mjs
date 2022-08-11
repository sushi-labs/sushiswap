import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['@sushiswap/ui', '@sushiswap/wagmi'])

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/kashi',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/sushi-cdn/image/fetch/',
  },
  experimental: {
    nextScriptWorkers: true,
  },
}

export default withTranspileModules(nextConfig)
