import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['@sushiswap/ui', '@sushiswap/graph-client'])

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/analytics',
  reactStrictMode: true,
  swcMinify: true,
}

export default withTranspileModules(nextConfig)
