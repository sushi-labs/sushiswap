import transpileModules from 'next-transpile-modules'
import mdx from '@next/mdx'

const withTranspileModules = transpileModules(['@sushiswap/ui'])

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    providerImportSource: '@mdx-js/react',
  },
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
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  }),
)
