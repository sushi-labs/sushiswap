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
        carouselSlide: {
          '0%': { transform: 'translateX(0%)' },
          '28.57%': { transform: 'translateX(0%)' },
          '33.33%': { transform: 'translateX(-50%)' },
          '61.90%': { transform: 'translateX(-50%)' },
          '66.66%': { transform: 'translateX(-100%)' },
          '95.23%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
      animation: {
        carouselSlide: 'carouselSlide 6s ease-in-out infinite',
      },
    },
  },
}

export default tailwindConfig
