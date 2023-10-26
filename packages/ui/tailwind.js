import sharedConfig from '@sushiswap/tailwindcss-config'

// @ts-check
/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  // prefix ui lib classes to avoid conflicting with the app
  prefix: 'ui-',
  presets: [sharedConfig],
}
export default tailwindConfig
