import { withThemeByClassName } from '@storybook/addon-styling'

import '@sushiswap/ui/src/index.css'

export const decorators = [
  withThemeByClassName({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
  }),
]
