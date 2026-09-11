import type { Meta, StoryObj } from '@storybook/react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@sushiswap/ui'
import { expect, userEvent, within } from 'storybook/test'

const meta = {
  title: 'Primitives/Command',
  component: Command,
} satisfies Meta<typeof Command>

export default meta
type Story = StoryObj<typeof meta>

function CommandExample() {
  return (
    <Command className="max-w-md rounded-xl border border-accent">
      <CommandInput placeholder="Search tokens or actions…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Tokens">
          <CommandItem>
            Ethereum<CommandShortcut>ETH</CommandShortcut>
          </CommandItem>
          <CommandItem>
            USD Coin<CommandShortcut>USDC</CommandShortcut>
          </CommandItem>
          <CommandItem disabled>Unavailable token</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem>Manage liquidity</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
export const Default = { render: () => <CommandExample /> } satisfies Story
export const Empty = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByRole('combobox'), 'no-matching-token')
    await expect(canvas.getByText('No results found.')).toBeVisible()
    await expect(canvas.queryByText('Ethereum')).not.toBeInTheDocument()
  },
} satisfies Story
