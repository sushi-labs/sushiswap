import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['@sushiswap/ui'])

export default withTranspileModules({
  images: {
    domains: ['localhost'],
  },
  basePath: '/blog',
  reactStrictMode: true,
  swcMinify: true,
})
