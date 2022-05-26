import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules([
  '@sushiswap/ui',
  '@sushiswap/redux-token-lists',
  '@sushiswap/chain',
  '@sushiswap/wagmi',
])

export default withTranspileModules({
  basePath: '/furo',
  reactStrictMode: true,
  swcMinify: true,
  runtime: 'edge',
  serverComponents: true,
  rewrites: {
    source: '/',
    destination: '/furo',
  },
  // TEMPORARY UNTIL TYPE ERROR IS SOLVED
  typescript: {
    ignoreBuildErrors: true,
  },
})
