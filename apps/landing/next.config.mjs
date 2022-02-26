import transpileModules from 'next-transpile-modules'

const withTranspileModules = transpileModules(['ui'])

export default withTranspileModules({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/sushi-cdn/image/fetch/',
  },
})
