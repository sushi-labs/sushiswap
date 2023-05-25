import defaultNextConfig from '@sushiswap/nextjs-config'

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...defaultNextConfig,
  images: {
    loader: 'cloudinary',
    path: 'https://cdn.sushi.com/image/upload/',
  },
  basePath: '/pools',
  // By default, Next.js only runs ESLint on the 'pages' and 'utils' directories
  // so we have to add additional directories to the dirs.
  eslint: {
    // ignoreDuringBuilds: true,
    dirs: ['app', 'components', 'lib', 'pages', 'types', 'ui'],
  },
  transpilePackages: ['@sushiswap/ui', '@sushiswap/wagmi'],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/pools',
        permanent: true,
        basePath: false,
      },
    ]
  },
}

export default nextConfig
