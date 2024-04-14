import defaultNextConfig from '@sushiswap/nextjs-config'

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...defaultNextConfig,
  // basePath: '/blog',
  transpilePackages: ['@sushiswap/ui'],
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/blog',
  //       permanent: true,
  //       basePath: false,
  //     },
  //   ]
  // },
}

export default nextConfig
