import sharedConfig from '@sushiswap/tailwindcss-config'

// @ts-check
/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  darkMode: 'class',
  content: [
    './stories/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './.storybook/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  presets: [sharedConfig],
  theme: {
    extend: {},
  },
}

export default tailwindConfig
