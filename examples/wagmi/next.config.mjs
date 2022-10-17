import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['@sushiswap/wagmi', '@sushiswap/ui'])

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  // TEMPORARY UNTIL TYPE ERROR IS SOLVED
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default withTranspileModules(nextConfig)
