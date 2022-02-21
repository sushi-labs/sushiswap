const withTM = require('next-transpile-modules')(['ui', 'config'])

const { BLOG_URL, ANALYTICS_URL, DOCS_URL } = process.env

module.exports = withTM({
  reactStrictMode: false,
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
    ]
  },
})
