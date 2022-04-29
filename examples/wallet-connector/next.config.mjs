import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['@sushiswap/wallet-connector', '@sushiswap/ui'])

export default withTranspileModules({
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // TEMPORARY UNTIL TYPE ERROR IS SOLVED
  typescript: {
    ignoreBuildErrors: true,
  },
})
