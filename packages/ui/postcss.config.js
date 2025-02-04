// If you want to use other PostCSS plugins, see the following:
// https://tailwindcss.com/docs/using-with-preprocessors

const path = require('node:path')

module.exports = {
  plugins: {
    tailwindcss: {
      config: path.join(__dirname, 'tailwind.js'),
    },
    autoprefixer: {},
  },
}
