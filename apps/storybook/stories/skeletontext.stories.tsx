// Skeleton.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import { SkeletonText, type SkeletonTextProps } from '@sushiswap/ui'

const fontSizes: SkeletonTextProps['fontSize'][] = [
  'xs',
  'sm',
  'default',
  'lg',
  'xl',
  '2xl',
  '3xl',
]
const meta = {
  title: 'Primitives/Skeleton/Text',
  component: SkeletonText,
  argTypes: {
    fontSize: {
      options: fontSizes,
      control: { type: 'select' },
    },
  },
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof SkeletonText>

export default meta
type Story = StoryObj<typeof SkeletonText>

export const Text = {
  args: {},
} satisfies Story
