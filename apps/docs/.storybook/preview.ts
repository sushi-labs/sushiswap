import '@sushiswap/ui/src/index.css'
import './style.css'

import { withThemeByClassName } from '@storybook/addon-styling'
import { Preview } from '@storybook/react'

export const decorators = [
  withThemeByClassName({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
  }),
]

export const preview: Preview = {
  parameters: {
    backgrounds: {
      disable: true,
    },
  },
}

export default preview
