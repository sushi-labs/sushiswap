// Checkbox.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import { Currency } from '@sushiswap/ui'
import { ChainId } from 'sushi'
import { SUSHI, USDT } from 'sushi/evm'

const meta = {
  title: 'Primitives/CurrencyIcon',
  component: Currency.Icon,
  argTypes: {
    width: {
      control: { type: 'number' },
    },
    height: {
      control: { type: 'number' },
    },
  },
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof Currency.Icon>

export default meta
type Story = StoryObj<typeof Currency.Icon>

export const Outline = {
  args: {
    width: 48,
    height: 48,
    currency: SUSHI[ChainId.ETHEREUM],
  },
} satisfies Story

export const List = {
  title: 'Primitives/CurrencyIconList',
  component: Currency.IconList,
  args: {
    children: () => {
      return (
        <>
          <Currency.Icon currency={SUSHI[ChainId.ETHEREUM]} />
          <Currency.Icon currency={USDT[ChainId.ETHEREUM]} />
        </>
      )
    },
  },
  argTypes: {
    width: {
      control: { type: 'number' },
    },
    height: {
      control: { type: 'number' },
    },
  },
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
  render: () => {
    return (
      <Currency.IconList iconWidth={48} iconHeight={48}>
        <Currency.Icon currency={SUSHI[ChainId.ETHEREUM]} />
        <Currency.Icon currency={USDT[ChainId.ETHEREUM]} />
      </Currency.IconList>
    )
  },
}
