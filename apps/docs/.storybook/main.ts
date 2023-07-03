// .storybook/main.ts

// Replace your-framework with the framework you are using (e.g., react-vite, vue3-vite)
import type { StorybookConfig } from '@storybook/react-vite'

import path from 'path'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-styling'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: true,
    defaultName: 'Documentation',
  },
  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
      optimizeDeps: {
        include: ['@sushiswap/chain', '@sushiswap/currency'],
      },
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
            find: '@sushiswap/chain',
            replacement: path.resolve(__dirname, '../../../packages/chain/'),
          },
          {
            find: '@sushiswap/currency',
            replacement: path.resolve(__dirname, '../../../packages/currency/'),
          },
        ],
      },
    })
  },
}

export default config
