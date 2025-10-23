// .storybook/main.ts

// Replace your-framework with the framework you are using (e.g., react-vite, vue3-vite)
import type { StorybookConfig } from '@storybook/react-vite'

import path from 'path'
import { fileURLToPath } from 'url'
import { mergeConfig } from 'vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-themes',
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
  viteFinal(config, { configType }) {
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
      optimizeDeps: {
        include: ['sushi'],
      },
      build: {
        commonjsOptions: { include: [/sushi/] },
        rollupOptions: {
          onwarn(warning, warn) {
            if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
              return
            }
            warn(warning)
          },
        },
      },
      resolve: {
        alias: [
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
