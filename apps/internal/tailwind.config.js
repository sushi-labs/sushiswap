// @ts-check
/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  presets: [require('@sushiswap/ui/tailwind')],
  content: [
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    '../../packages/ui/{,!(node_modules)/**/}*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
}

module.exports = tailwindConfig
