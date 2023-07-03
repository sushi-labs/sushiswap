// .storybook/main.ts

// Replace your-framework with the framework you are using (e.g., react-vite, vue3-vite)
import type { StorybookConfig } from '@storybook/react-vite'

import path from 'path'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.tsx', '../stories/**/*.stories.ts'],
  addons: [
    '@storybook/addon-mdx-gfm',
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-docs',
    {
      name: '@storybook/addon-styling',
      options: {
        // Check out https://github.com/storybookjs/addon-styling/blob/main/docs/api.md
        // For more details on this addon's options.
        postCss: true,
      },
    },
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
    // customize the Vite config here
    return mergeConfig(config, {
      optimizeDeps: {
        include: ['@sushiswap/chain', '@sushiswap/ui'],
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
        ],
      },
    })
  },
}

export default config
