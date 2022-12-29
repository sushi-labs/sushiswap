// @ts-check
/** @type {import('next').NextConfig} */
const defaultNextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  experimental: {
    esmExternals: "loose",
  },
  images: {
    loader: "cloudinary",
    path: "https://res.cloudinary.com/sushi-cdn/image/fetch/",
  },
  productionBrowserSourceMaps: true,
};

module.exports = defaultNextConfig;
