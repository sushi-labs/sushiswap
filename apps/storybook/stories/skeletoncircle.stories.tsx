// Skeleton.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import { SkeletonCircle } from '@sushiswap/ui'
import * as React from 'react'

const meta = {
  title: 'Primitives/Skeleton/Circle',
  component: SkeletonCircle,
  argTypes: {
    radius: {
      control: { type: 'number', value: 30 },
    },
  },
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof SkeletonCircle>

export default meta
type Story = StoryObj<typeof SkeletonCircle>

export const Circle = {
  args: {},
  render: (args) => {
    return <SkeletonCircle radius={30} {...args} />
  },
} satisfies Story
