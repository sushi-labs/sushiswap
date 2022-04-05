import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['ui'])

export default withTranspileModules({
  basePath: '/furo',
  reactStrictMode: true,
  swcMinify: true,
})
