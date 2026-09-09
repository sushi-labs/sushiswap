import type { Meta, StoryObj } from '@storybook/react'
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@sushiswap/ui'

const meta = {
  title: 'Primitives/DropdownMenu',
  component: DropdownMenu,
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  args: { defaultOpen: true },
  render: (args) => (
    <div className="min-h-96 p-8">
      <DropdownMenu {...args}>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">Position actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel>ETH / USDC</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Add liquidity<DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>Remove liquidity</DropdownMenuItem>
          <DropdownMenuItem disabled>Collect fees</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>
            Show balances
          </DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup value="usd">
            <DropdownMenuRadioItem value="usd">USD</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="eth">ETH</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
} satisfies Story
export const Closed = {
  ...Default,
  args: { defaultOpen: false },
} satisfies Story
