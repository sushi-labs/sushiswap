import type { Meta, StoryObj } from '@storybook/react'
import { ScrollArea, ScrollBar, Separator } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/ScrollArea',
  component: ScrollArea,
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

export const Vertical = {
  render: () => (
    <ScrollArea className="h-64 w-72 rounded-xl border border-accent">
      <div className="p-4">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i}>
            <div className="py-3 text-sm">Liquidity position {i + 1}</div>
            <Separator />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
} satisfies Story
export const Horizontal = {
  render: () => (
    <ScrollArea className="w-80 rounded-xl border border-accent">
      <div className="flex w-max gap-4 p-4">
        {['Ethereum', 'Arbitrum', 'Base', 'Polygon', 'Optimism'].map(
          (network) => (
            <div key={network} className="w-40 rounded-lg bg-secondary p-6">
              {network}
            </div>
          ),
        )}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
} satisfies Story
