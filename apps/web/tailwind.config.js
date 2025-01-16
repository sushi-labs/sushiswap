import sharedConfig from '@sushiswap/tailwindcss-config'

// @ts-check
/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  darkMode: 'class',
  presets: [sharedConfig],
  content: [...sharedConfig.content],
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
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-833px)' },
        },
      },
      animation: {
        marquee: 'marquee 5s linear infinite',
      },
    },
  },
}

export default tailwindConfig
