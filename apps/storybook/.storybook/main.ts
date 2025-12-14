// .storybook/main.ts

// Replace your-framework with the framework you are using (e.g., react-vite, vue3-vite)
import type { StorybookConfig } from '@storybook/react-vite'

import path, { dirname, join } from 'path'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.tsx'],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-themes'),
    getAbsolutePath('@storybook/addon-designs'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
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

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}