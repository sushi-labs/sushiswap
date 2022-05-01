import transpileModules from 'next-transpile-modules'
import mdx from '@next/mdx'

const withTranspileModules = transpileModules(['@sushiswap/ui'])

const withMDX = mdx({
  extension: /\.mdx?$/,
})

export default withTranspileModules(
  withMDX({
    basePath: '/dao',
    reactStrictMode: true,
    swcMinify: true,
    // TEMPORARY UNTIL TYPE ERROR IS SOLVED
    typescript: {
      ignoreBuildErrors: true,
    },
    pageExtensions: ['ts', 'tsx', 'mdx'],
  }),
)
