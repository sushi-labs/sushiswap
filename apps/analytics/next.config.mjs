import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['ui'], { resolveSymlinks: true, debug: true })

export default withTranspileModules({
  basePath: '/analytics',
  reactStrictMode: true,
  // swcMinify: true,
})
