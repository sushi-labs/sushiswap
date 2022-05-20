import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules([
  '@sushiswap/ui',
  '@sushiswap/redux-token-lists',
  '@sushiswap/chain',
  '@sushiswap/currency',
  '@sushiswap/wallet-connector',
  '@sushiswap/stargate',
])

export default withTranspileModules({
  basePath: '/swap',
  reactStrictMode: true,
  swcMinify: true,
  // TEMPORARY UNTIL TYPE ERROR IS SOLVED
  typescript: {
    ignoreBuildErrors: true,
  },
})
