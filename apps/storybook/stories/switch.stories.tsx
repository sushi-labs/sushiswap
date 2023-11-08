// Switch.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import { Switch } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/Switch',
  component: Switch,
  argTypes: {
    checked: {
      options: [true, false],
      control: { type: 'boolean' },
    },
  },
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof Switch>

export const Default = {
  args: {
    children: 'Switch',
  },
} satisfies Story
