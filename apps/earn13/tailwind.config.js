// @ts-check
/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  presets: [require('@sushiswap/ui13/tailwind')],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui13/{,!(node_modules)/**/}*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
}

module.exports = tailwindConfig
