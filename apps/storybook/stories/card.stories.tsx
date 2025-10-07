// Checkbox.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import {
  Button,
  Card,
  CardContent,
  CardCurrencyAmountItem,
  CardDescription,
  CardFooter,
  CardGroup,
  CardHeader,
  CardLabel,
  type CardProps,
  CardTitle,
} from '@sushiswap/ui'
import * as React from 'react'
import { Amount, ChainId } from 'sushi'
import { SUSHI, USDT } from 'sushi/evm'

const variants: CardProps['variant'][] = ['default', 'outline']

const meta = {
  title: 'Primitives/Card',
  component: Card,
  argTypes: {
    variant: {
      options: variants,
      control: { type: 'select' },
    },
  },
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof Card>

export const Outline = {
  args: {},
  render: () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Example card</CardTitle>
          <CardDescription>Example description for a card</CardDescription>
        </CardHeader>
        <CardContent>
          <CardGroup>
            <CardLabel>{"You'll"} receive collected fees</CardLabel>
            <CardCurrencyAmountItem
              amount={new Amount(SUSHI[ChainId.ETHEREUM], 100)}
            />
            <CardCurrencyAmountItem
              amount={new Amount(USDT[ChainId.ETHEREUM], 100)}
            />
          </CardGroup>
        </CardContent>
        <CardFooter>
          <Button>Example button</Button>
        </CardFooter>
      </Card>
    )
  },
} satisfies Story

export const Default = {
  args: {},
  render: () => {
    return (
      <Card variant="outline">
        <CardHeader>
          <CardTitle>Example card</CardTitle>
          <CardDescription>Example description for a card</CardDescription>
        </CardHeader>
        <CardContent>
          <CardGroup>
            <CardLabel>{"You'll"} receive collected fees</CardLabel>
            <CardCurrencyAmountItem
              amount={new Amount(SUSHI[ChainId.ETHEREUM], 100)}
            />
            <CardCurrencyAmountItem
              amount={new Amount(USDT[ChainId.ETHEREUM], 100)}
            />
          </CardGroup>
        </CardContent>
        <CardFooter>
          <Button>Example button</Button>
        </CardFooter>
      </Card>
    )
  },
} satisfies Story
