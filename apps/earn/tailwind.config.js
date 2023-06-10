// @ts-check
/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  darkMode: 'class',
  // @ts-ignore
  presets: [require('@sushiswap/ui/tailwind')],
  theme: {
    extend: {},
  },
}

module.exports = tailwindConfig
