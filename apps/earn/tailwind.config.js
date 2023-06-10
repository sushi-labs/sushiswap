// @ts-check
/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  darkMode: 'class',
  // @ts-ignore
  presets: [require('@sushiswap/ui/tailwind.js')],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './common/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './ui/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@sushiswap/wagmi/!(node_modules)/**/*.{ts,tsx,mdx}',
    './node_modules/@sushiswap/ui/!(node_modules)/**/*.{ts,tsx,mdx}',
  ],
}

module.exports = tailwindConfig
