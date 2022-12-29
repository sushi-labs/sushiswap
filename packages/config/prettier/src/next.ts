import { Options } from 'prettier'

import base from './base'

export const options: Options = {
  ...base,
  plugins: [require('prettier-plugin-tailwindcss')],
}

export default options
