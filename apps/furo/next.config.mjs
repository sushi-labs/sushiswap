import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['@sushiswap/ui'])

export default withTranspileModules({
  basePath: '/furo',
  reactStrictMode: true,
  // swcMinify: true,
  // TEMPORARY UNTIL TYPE ERROR IS SOLVED
  typescript: {
    ignoreBuildErrors: true,
  },
})
