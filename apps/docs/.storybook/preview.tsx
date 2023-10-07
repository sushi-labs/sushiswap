import React from 'react'
import '@sushiswap/ui/index.css'
import './style.css'
import { Preview } from '@storybook/react'
import { ThemeProvider } from '@sushiswap/ui'

export const withThemeProvider = (Story, context) => {
  const theme = context.globals.theme

  return (
    <ThemeProvider forcedTheme={theme}>
      <Story {...context} />
    </ThemeProvider>
  )
}

export const preview: Preview = {
  parameters: {
    backgrounds: {
      disable: true,
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        // The label to show for this toolbar item
        title: 'Theme',
        icon: 'circlehollow',
        // Array of plain string values or MenuItem shape (see below)
        items: ['light', 'dark'],
        // Change title based on selected value
        dynamicTitle: true,
      },
    },
  },
  decorators: [withThemeProvider],
}

export default preview
