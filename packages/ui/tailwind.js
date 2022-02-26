module.exports = {
  // `content` is replaced instead of extended, so this line has to be added in
  // the `content` of each app' tailwind.config.js
  content: ['node_modules/ui/**/*.{js,ts,jsx,tsx}'],
  // theme: {
  //   extend: {},
  // },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
  ],
}
