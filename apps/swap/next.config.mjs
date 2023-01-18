import defaultNextConfig from '@sushiswap/nextjs-config'

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...defaultNextConfig,
  basePath: '/swap',
  // By default, Next.js only runs ESLint on the 'pages' and 'utils' directories
  // so we have to add additional directories to the dirs.
  eslint: {
    dirs: ['pages', 'components', 'lib', 'app', 'ui'],
  },
  transpilePackages: ['@sushiswap/ui13', '@sushiswap/wagmi13'],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/swap',
        permanent: true,
        basePath: false,
      },
      {
        source: '/swap',
        // Change to /1/1/ETH/SUSHI before launch
        destination: '/swap/137/137/MATIC/SUSHI',
        permanent: true,
        basePath: false,
      },
    ]
  },
}

export default nextConfig
