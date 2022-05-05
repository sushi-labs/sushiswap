import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['@sushiswap/ui'])

export default withTranspileModules({
  basePath: '/bridge',
  reactStrictMode: true,
  swcMinify: true,
})
