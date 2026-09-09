import type { Meta, StoryObj } from '@storybook/react'
import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@sushiswap/ui'

const meta = {
  title: 'Primitives/Sheet',
  component: Sheet,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

function SheetExample({ side }: { side: 'left' | 'right' | 'top' | 'bottom' }) {
  return (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <Button>Open sheet</Button>
      </SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Position details</SheetTitle>
          <SheetDescription>Review your liquidity position.</SheetDescription>
        </SheetHeader>
        <div className="py-8">ETH / USDC · 0.3% fee</div>
        <SheetFooter>
          <SheetClose asChild>
            <Button>Done</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
export const Right = {
  render: () => <SheetExample side="right" />,
} satisfies Story
export const Left = {
  render: () => <SheetExample side="left" />,
} satisfies Story
export const Top = { render: () => <SheetExample side="top" /> } satisfies Story
export const Bottom = {
  render: () => <SheetExample side="bottom" />,
} satisfies Story
