import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules([
  '@sushiswap/ui',
  '@sushiswap/chain',
  // '@sushiswap/redux-token-lists',
  '@sushiswap/wallet-connector',
])

export default withTranspileModules({
  basePath: '/onsen',
  reactStrictMode: true,
  swcMinify: true,
  // runtime: 'edge',
  // serverComponents: true,
  // rewrites: {
  //   source: '/',
  //   destination: '/on',
  // },
  // TEMPORARY UNTIL TYPE ERROR IS SOLVED
  typescript: {
    ignoreBuildErrors: true,
  },
})
