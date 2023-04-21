const { default: config } = require("@sushiswap/prettier-config");

module.exports = {
  ...config,
  plugins: [require("prettier-plugin-tailwindcss")],
};
