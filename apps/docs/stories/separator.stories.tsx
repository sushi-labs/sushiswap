// Input.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import { Separator } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/Separator',
  component: Separator,
  args: {
    orientation: 'horizontal',
  },
  argTypes: {
    orientation: {
      options: ['horizontal', 'vertical'],
      control: { type: 'radio' },
    },
  },
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof Separator>

export const Default = {
  render: (args) => {
    return <Separator {...args} />
  },
} satisfies Story
