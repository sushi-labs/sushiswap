// Input.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import { LinkExternal } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/Link/External',
  component: LinkExternal,
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof LinkExternal>

export default meta
type Story = StoryObj<typeof LinkExternal>

export const External = {
  args: {
    children: 'Google',
    href: 'https://google.com',
  },
  render: (args) => {
    return <LinkExternal {...args} />
  },
} satisfies Story
