import type { Meta, StoryObj } from '@storybook/react'
import { SkeletonBox } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/SkeletonBox',
  component: SkeletonBox,
} satisfies Meta<typeof SkeletonBox>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  args: { className: 'h-32 w-64 rounded-xl' },
} satisfies Story
export const Card = {
  render: () => (
    <div className="max-w-sm space-y-4 rounded-xl border border-accent p-6">
      <SkeletonBox className="h-40 w-full rounded-lg" />
      <SkeletonBox className="h-5 w-3/4 rounded" />
      <SkeletonBox className="h-4 w-1/2 rounded" />
    </div>
  ),
} satisfies Story
