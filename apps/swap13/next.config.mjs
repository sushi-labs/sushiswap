import defaultNextConfig from '@sushiswap/nextjs-config'

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...defaultNextConfig,
  basePath: '/swap13',
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
        destination: '/swap13',
        permanent: true,
        basePath: false,
      },
      {
        source: '/swap13',
        destination: '/swap13/137/137/MATIC/SUSHI',
        permanent: true,
        basePath: false,
      },
    ]
  },
}

export default nextConfig
