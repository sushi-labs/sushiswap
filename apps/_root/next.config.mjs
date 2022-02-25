import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['ui', 'chains'])

const { BLOG_URL, ANALYTICS_URL, DOCS_URL, STORE_URL, LEGACY_URL } = process.env

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
        source: '/:path*',
        destination: `/:path*`,
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
        source: '/docs',
        destination: `${DOCS_URL}/docs`,
      },
      {
        source: '/docs/:path*',
        destination: `${DOCS_URL}/docs/:path*`,
      },
      // {
      //   source: '/store',
      //   destination: `${STORE_URL}/store`,
      // },
      // {
      //   source: '/store/:path*',
      //   destination: `${STORE_URL}/store/:path*`,
      // },

      // {
      //   source: '/legacy',
      //   destination: `${LEGACY_URL}/legacy`,
      // },
      // {
      //   source: '/legacy/:path*',
      //   destination: `${LEGACY_URL}/legacy/:path*`,
      // },
    ]
  },
})
