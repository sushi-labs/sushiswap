// Input.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import { LinkInternal } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/Link/Internal',
  component: LinkInternal,
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof LinkInternal>

export default meta
type Story = StoryObj<typeof LinkInternal>

export const Internal = {
  args: {
    children: 'Swap',
    href: '/swap',
  },
  render: (args) => {
    return <LinkInternal {...args} />
  },
} satisfies Story
