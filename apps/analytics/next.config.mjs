import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['ui'])

export default withTranspileModules({
  basePath: '/analytics',
  reactStrictMode: true,
  // swcMinify: true,
})
