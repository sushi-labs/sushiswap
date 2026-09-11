import type { Meta, StoryObj } from '@storybook/react'
import { Button, Collapsible } from '@sushiswap/ui'
import { useState } from 'react'
const meta = {
  title: 'Primitives/Collapsible',
  component: Collapsible,
  parameters: { chromatic: { delay: 500 } },
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj<typeof Collapsible>

function CollapsibleExample({ initiallyOpen }: { initiallyOpen: boolean }) {
  const [open, setOpen] = useState(initiallyOpen)
  return (
    <div className="max-w-md space-y-4">
      <Button aria-expanded={open} onClick={() => setOpen(!open)}>
        Position details
      </Button>
      <Collapsible open={open}>
        <div className="rounded-xl border border-accent p-6">
          Your liquidity earns fees while the position is in range.
        </div>
      </Collapsible>
    </div>
  )
}
export const Open = {
  render: () => <CollapsibleExample initiallyOpen />,
} satisfies Story
export const Closed = {
  render: () => <CollapsibleExample initiallyOpen={false} />,
} satisfies Story
