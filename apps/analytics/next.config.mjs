import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['@sushiswap/ui', '@sushiswap/graph-client'])

export default withTranspileModules({
  basePath: '/analytics',
  reactStrictMode: true,
  swcMinify: true,
})
