import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['@sushiswap/chain', '@sushiswap/wagmi', '@sushiswap/ui'])

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/partner',
  reactStrictMode: true,
  swcMinify: true,
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ]
  },
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/sushi-cdn/image/fetch/',
    domains: ['app.sushi.com', 'raw.githubusercontent.com'],
  },
  experimental: {
    nextScriptWorkers: true,
  },
}

export default withTranspileModules(nextConfig)
