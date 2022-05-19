import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['@sushiswap/ui', '@sushiswap/chain'])

const { BLOG_URL, ANALYTICS_URL, DAO_URL, DOCS_URL, FURO_URL, LANDING_URL, SWAP_URL, LEGACY_URL } = process.env

export default withTranspileModules({
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/discord{/}?',
        permanent: true,
        destination: 'https://discord.gg/SDPH8SNVZW',
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: `${LANDING_URL}/landing`,
      },
      {
        source: '/analytics',
        destination: `${ANALYTICS_URL}/analytics`,
      },
      {
        source: '/analytics/:path*',
        destination: `${ANALYTICS_URL}/analytics/:path*`,
      },
      {
        source: '/blog',
        destination: `${BLOG_URL}/blog`,
      },
      {
        source: '/blog/:path*',
        destination: `${BLOG_URL}/blog/:path*`,
      },
      {
        source: '/dao',
        destination: `${DAO_URL}/dao`,
      },
      {
        source: '/dao/:path*',
        destination: `${DAO_URL}/dao/:path*`,
      },
      {
        source: '/docs',
        destination: `${DOCS_URL}/docs`,
      },
      {
        source: '/docs/:path*',
        destination: `${DOCS_URL}/docs/:path*`,
      },
      {
        source: '/furo',
        destination: `${FURO_URL}/furo`,
      },
      {
        source: '/furo/:path*',
        destination: `${FURO_URL}/furo/:path*`,
      },
      {
        source: '/swap',
        destination: `${SWAP_URL}/swap`,
      },
      {
        source: '/swap/:path*',
        destination: `${SWAP_URL}/swap/:path*`,
      },
      {
        source: '/legacy',
        destination: `${LEGACY_URL}/legacy`,
      },
      {
        source: '/legacy/:path*',
        destination: `${LEGACY_URL}/legacy/:path*`,
      },
    ]
  },
})
