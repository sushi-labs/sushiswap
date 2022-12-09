import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['@sushiswap/ui'])

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/sushi-cdn/image/fetch/',
  },
  basePath: '/academy',
  reactStrictMode: true,
  swcMinify: false,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/academy',
        permanent: true,
        basePath: false,
      },
    ]
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}

export default withTranspileModules(nextConfig)
