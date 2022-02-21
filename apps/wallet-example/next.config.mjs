import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['config', 'chain', 'wallet-connector'])

export default withTranspileModules({
  reactStrictMode: true,
  swcMinify: true,
})
