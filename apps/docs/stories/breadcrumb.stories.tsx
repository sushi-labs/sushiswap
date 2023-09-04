// Input.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import { Breadcrumb } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof Breadcrumb>

export const Default = {
  render: () => {
    return <Breadcrumb />
  },
} satisfies Story
