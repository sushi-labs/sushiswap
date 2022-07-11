import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules([
  '@sushiswap/ui',
  '@sushiswap/redux-localstorage',
  '@sushiswap/redux-token-lists',
  '@sushiswap/chain',
  '@sushiswap/wagmi',
  '@sushiswap/graph-client',
])

export default withTranspileModules({
  basePath: '/furo',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/sushi-cdn/image/fetch/',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
})
