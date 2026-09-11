import type { Meta, StoryObj } from '@storybook/react'
import { FormattedNumber } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/FormattedNumber',
  component: FormattedNumber,
} satisfies Meta<typeof FormattedNumber>

export default meta
type Story = StoryObj<typeof meta>

export const Default = { args: { number: 1234567.89 } } satisfies Story
export const Small = { args: { number: '0.0000001234' } } satisfies Story
export const Zero = { args: { number: 0 } } satisfies Story
export const Negative = { args: { number: -1234.56 } } satisfies Story
export const Infinite = {
  args: { number: Number.POSITIVE_INFINITY },
} satisfies Story
