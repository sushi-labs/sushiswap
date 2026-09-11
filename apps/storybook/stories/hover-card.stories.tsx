import type { Meta, StoryObj } from '@storybook/react'
import {
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@sushiswap/ui'

const meta = {
  title: 'Primitives/HoverCard',
  component: HoverCard,
} satisfies Meta<typeof HoverCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  args: { defaultOpen: true },
  render: (args) => (
    <div className="min-h-64 p-8">
      <HoverCard {...args}>
        <HoverCardTrigger asChild>
          <Button variant="link">Pool details</Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-64">
          <p className="font-semibold">ETH / USDC</p>
          <p className="text-sm text-muted-foreground">
            A concentrated liquidity pool with a 0.3% fee.
          </p>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
} satisfies Story
export const Closed = {
  ...Default,
  args: { defaultOpen: false },
} satisfies Story
