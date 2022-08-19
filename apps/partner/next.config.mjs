import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['@sushiswap/chain', '@sushiswap/wagmi', '@sushiswap/ui'])

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/partner',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/sushi-cdn/image/fetch/',
    domains: ['app.sushi.com', 'raw.githubusercontent.com'],
  },
  experimental: {
    nextScriptWorkers: true,
  },
}

export default withTranspileModules(nextConfig)
