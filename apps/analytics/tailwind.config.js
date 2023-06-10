/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  presets: [require('@sushiswap/ui/tailwind.js')],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './common/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './ui/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/wagmi/!(node_modules)/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/!(node_modules)/**/*.{js,ts,jsx,tsx,mdx}',
  ],
}
