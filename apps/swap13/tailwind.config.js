// @ts-check
/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  presets: [require("@sushiswap/ui13/tailwind")],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./ui/**/*.{js,ts,jsx,tsx}",
    "../../packages/wagmi13/{components,systems}/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui13/{,!(node_modules)/**/}*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
};

module.exports = tailwindConfig;
