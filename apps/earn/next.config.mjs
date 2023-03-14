import defaultNextConfig from '@sushiswap/nextjs-config'

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...defaultNextConfig,
  images: {
    loader: 'cloudinary',
    path: 'https://cdn.sushi.com/image/upload/',
  },
  basePath: '/earn',
  transpilePackages: [
    '@sushiswap/redux-token-lists',
    '@sushiswap/redux-localstorage',
    '@sushiswap/wagmi',
    '@sushiswap/ui',
  ],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/earn',
        permanent: true,
        basePath: false,
      },
    ]
  },
}

export default nextConfig
