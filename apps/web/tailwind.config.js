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
        slide: {
          '0%': {
            opacity: 0,
            transform: 'translateY(-60px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
        'slide-secondary': {
          '0%': {
            opacity: 0,
            transform: 'translateY(-25px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        marquee: 'marquee 5s linear infinite',
        slide: 'slide .5s',
        'slide-secondary': 'slide-secondary .4s',
      },
    },
  },
}

export default tailwindConfig
