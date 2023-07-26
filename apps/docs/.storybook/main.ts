// .storybook/main.ts

// Replace your-framework with the framework you are using (e.g., react-vite, vue3-vite)
import type { StorybookConfig } from '@storybook/react-vite'

import path from 'path'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-styling',
    '@storybook/addon-designs',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: true,
    defaultName: 'Documentation',
  },
  async viteFinal(config, { configType }) {
    if (configType === 'DEVELOPMENT') {
      // Your development configuration goes here
    }
    if (configType === 'PRODUCTION') {
      // Your production configuration goes here.
    }

    return mergeConfig(config, {
      define: {
        'process.env': {},
      },
      resolve: {
        alias: [
          {
            find: '@sushiswap/ui',
            replacement: path.resolve(__dirname, '../../../packages/ui/'),
          },
          {
            find: '@sushiswap/router-config',
            replacement: path.resolve(__dirname, '../../../config/router/'),
          },
        ],
      },
    })
  },
}

export default config
