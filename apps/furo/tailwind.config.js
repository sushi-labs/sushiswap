module.exports = {
  presets: [require('@sushiswap/ui/tailwind')],
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    '../../packages/wagmi/**/*.tsx',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      display: ['group-hover'],
      visibility: ['group-hover'],
      backgroundImage: () => ({
        circuit: "url('/furo/images/circuit.png')",
      }),
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
