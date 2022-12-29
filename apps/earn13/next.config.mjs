// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/earn13",
  reactStrictMode: true,
  swcMinify: false,
  productionBrowserSourceMaps: true,
  experimental: {
    appDir: true,
    transpilePackages: [
      "@sushiswap/redux-token-lists",
      "@sushiswap/redux-localstorage",
      "@sushiswap/wagmi",
      "@sushiswap/ui13",
    ],
    esmExternals: "loose",
  },
  images: {
    loader: "cloudinary",
    path: "https://res.cloudinary.com/sushi-cdn/image/fetch/",
  },
  staticPageGenerationTimeout: 180,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/earn",
        permanent: true,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;
