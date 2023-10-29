// Input.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import { Label } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/Label',
  component: Label,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof Label>

export const Default = {
  args: {
    children: 'Label',
  },
  render: (args) => {
    return <Label {...args} />
  },
} satisfies Story
