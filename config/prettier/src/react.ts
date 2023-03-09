import { Options } from 'prettier'

export const options: Options = {
  endOfLine: 'lf',
  printWidth: 120,
  tabWidth: 2,
  singleQuote: true,
  semi: false,
  plugins: [require('prettier-plugin-tailwindcss')],
}

export default options
