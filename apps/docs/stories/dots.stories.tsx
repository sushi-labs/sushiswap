// Dots.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import { Dots } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/Dots',
  component: Dots,
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof Dots>

export default meta
type Story = StoryObj<typeof Dots>

export const Default = {
  args: {
    children: 'Dots',
  },
} satisfies Story
