import type { Meta, StoryObj } from '@storybook/react'
import { Reply, ReplyContent } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/Reply',
  component: Reply,
} satisfies Meta<typeof Reply>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  render: () => (
    <Reply>
      <ReplyContent>Your position is ready to manage.</ReplyContent>
    </Reply>
  ),
} satisfies Story
export const Nested = {
  render: () => (
    <div className="flex max-w-lg flex-col gap-4">
      <ReplyContent>How do I manage liquidity?</ReplyContent>
      <Reply>
        <ReplyContent>
          Open your position to add or remove liquidity.
        </ReplyContent>
      </Reply>
    </div>
  ),
} satisfies Story
