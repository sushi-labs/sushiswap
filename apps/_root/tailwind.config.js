// @ts-check
/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  darkMode: 'class',
  presets: [require('@sushiswap/ui/tailwind')],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './app/**/components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './ui/**/*.{js,ts,jsx,tsx}',
    './node_modules/wagmi/{components,systems,future,!(node_modules)/}**/*.{js,ts,jsx,tsx}',
    './node_modules/ui/{,!(node_modules)/}**/*.{js,ts,jsx,tsx}',
    // './node_modules/wagmi/{,!(node_modules)/}**/*.{js,ts,jsx,tsx}',
    // './node_modules/ui/{,!(node_modules)/}**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      display: ['group-hover'],
      visibility: ['group-hover'],
      keyframes: {
        dash: {
          to: {
            'stroke-dashoffset': '0',
          },
        },
      },
    },
  },
}

module.exports = tailwindConfig
