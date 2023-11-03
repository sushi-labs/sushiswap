// Checkbox.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from '@sushiswap/ui'
import * as React from 'react'

const meta = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  argTypes: {
    checked: {
      control: { type: 'boolean' },
    },
  },
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default = {
  args: {},
  render: (args) => {
    return <Checkbox checked {...args} />
  },
} satisfies Story
