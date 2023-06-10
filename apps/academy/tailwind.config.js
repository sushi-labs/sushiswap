// @ts-check
/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  darkMode: 'class',
  presets: [require('@sushiswap/ui/tailwind')],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}

module.exports = tailwindConfig
