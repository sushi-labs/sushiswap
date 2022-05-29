import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules([
  '@sushiswap/redux-token-lists',
  '@sushiswap/chain',
  '@sushiswap/wagmi',
  '@sushiswap/stargate',
  '@sushiswap/ui',
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
