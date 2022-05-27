import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['@sushiswap/wagmi', '@sushiswap/ui'])

export default withTranspileModules({
  reactStrictMode: true,
  swcMinify: true,
  // TEMPORARY UNTIL TYPE ERROR IS SOLVED
  typescript: {
    ignoreBuildErrors: true,
  },
})
