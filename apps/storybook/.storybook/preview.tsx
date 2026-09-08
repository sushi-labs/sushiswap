import type { Preview } from '@storybook/nextjs-vite'
import { BaseProviders } from '@sushiswap/ui'
import '@sushiswap/ui/index.css'
import './style.css'

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    docs: { story: { inline: false, iframeHeight: 420 } },
    backgrounds: { disable: true },
    nextjs: { appDirectory: true },
    chromatic: {
      modes: {
        'light desktop': {
          theme: 'light',
          viewport: { width: 1280, height: 900 },
        },
        'dark desktop': {
          theme: 'dark',
          viewport: { width: 1280, height: 900 },
        },
        'black desktop': {
          theme: 'black',
          viewport: { width: 1280, height: 900 },
        },
        'light mobile': {
          theme: 'light',
          viewport: { width: 390, height: 844 },
        },
        'dark mobile': { theme: 'dark', viewport: { width: 390, height: 844 } },
        'black mobile': {
          theme: 'black',
          viewport: { width: 390, height: 844 },
        },
      },
    },
  },
  initialGlobals: { theme: 'light' },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark', 'black'],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => (
      <BaseProviders forcedTheme={context.globals.theme}>
        <Story />
      </BaseProviders>
    ),
  ],
}

export default preview
