import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['ui'])

export default withTranspileModules({
  basePath: '/onsen',
  reactStrictMode: true,
  swcMinify: true,
})
