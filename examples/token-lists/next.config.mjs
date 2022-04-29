import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['@sushiswap/ui', '@sushiswap/redux-token-lists', '@sushiswap/chain'])

export default withTranspileModules({
  reactStrictMode: true,
  swcMinify: true,
})
