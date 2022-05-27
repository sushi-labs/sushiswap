import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules([
  '@sushiswap/ui',
  '@sushiswap/chain',
  // '@sushiswap/redux-token-lists',
  '@sushiswap/wagmi',
])

export default withTranspileModules({
  basePath: '/onsen',
  reactStrictMode: true,
  swcMinify: true,
  // runtime: 'edge',
  serverComponents: true,
  rewrites: {
    source: '/',
    destination: '/onsen',
  },
  // TEMPORARY UNTIL TYPE ERROR IS SOLVED
  typescript: {
    ignoreBuildErrors: true,
  },
})
