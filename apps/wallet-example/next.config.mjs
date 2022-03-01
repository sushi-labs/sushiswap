import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['chain', 'wallet-connector'])

export default withTranspileModules({
  reactStrictMode: true,
  swcMinify: true,
})
