module.exports = {
  presets: [require('ui/tailwind')],
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    'node_modules/ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
}
