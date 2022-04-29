import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['@sushiswap/wallet-connector', '@sushiswap/ui'])

export default withTranspileModules({
  reactStrictMode: true,
  swcMinify: true,
})
