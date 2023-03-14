import defaultNextConfig from '@sushiswap/nextjs-config'

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...defaultNextConfig,
  images: {
    loader: 'cloudinary',
    path: 'https://cdn.sushi.com/image/upload/',
  },
  basePath: '/analytics',
  transpilePackages: ['@sushiswap/redux-localstorage', '@sushiswap/wagmi', '@sushiswap/ui'],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/analytics',
        permanent: true,
        basePath: false,
      },
    ]
  },
}

export default nextConfig
