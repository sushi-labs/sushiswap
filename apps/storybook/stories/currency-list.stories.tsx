import type { Meta, StoryObj } from '@storybook/react'
import { Currency } from '@sushiswap/ui'
import type { CSSProperties } from 'react'
const meta = {
  title: 'Primitives/Currency.List',
  component: Currency.List,
} satisfies Meta<typeof Currency.List>

export default meta
type Story = StoryObj<typeof Currency.List>

type TokenRow = { symbol: string; name: string; style?: CSSProperties }
function TokenRow({ symbol, name, style }: TokenRow) {
  return (
    <div style={style} className="flex items-center justify-between px-4">
      <span className="font-medium">{symbol}</span>
      <span className="text-muted-foreground">{name}</span>
    </div>
  )
}
export const Default = {
  render: () => (
    <div className="h-64 max-w-sm rounded-xl border border-accent">
      <Currency.List
        rowHeight={48}
        rowData={[
          { symbol: 'ETH', name: 'Ethereum' },
          { symbol: 'USDC', name: 'USD Coin' },
          { symbol: 'SUSHI', name: 'Sushi' },
        ]}
        rowRenderer={TokenRow}
      />
    </div>
  ),
} satisfies Story
