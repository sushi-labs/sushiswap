module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'd1c3ab7fa9542aebe82d4d3838761b79'),
  },
})
