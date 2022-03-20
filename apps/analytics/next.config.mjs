import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['ui'])

export default withTranspileModules({
  basePath: '/analytics',
  reactStrictMode: false,
  swcMinify: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false
      config.resolve.fallback.module = false
    }
    return config
  },
})
