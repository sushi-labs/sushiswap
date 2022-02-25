import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['config', 'chains', 'wallet-connector'])

export default withTranspileModules({
  reactStrictMode: true,
  swcMinify: true,
})
