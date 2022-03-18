import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['ui'])

export default withTranspileModules({
  basePath: '/dao',
  reactStrictMode: true,
  // swcMinify: true,
  // webpack: (config) => {
  //   config.externals['fetch'] = 'cross-fetch'
  //   return config
  // }
})
