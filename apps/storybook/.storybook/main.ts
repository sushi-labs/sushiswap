import type { StorybookConfig } from '@storybook/nextjs-vite'

const config: StorybookConfig = {
  staticDirs: ['../public'],
  stories: ['../stories/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-designs',
  ],
  framework: '@storybook/nextjs-vite',
  docs: { defaultName: 'Documentation' },
}

export default config
