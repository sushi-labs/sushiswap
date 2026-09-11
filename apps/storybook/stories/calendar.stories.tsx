import type { Meta, StoryObj } from '@storybook/react'
import { Calendar } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/Calendar',
  component: Calendar,
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

const today = new Date(2026, 0, 15)
export const Single = {
  args: { mode: 'single', defaultMonth: today, today, selected: today },
} satisfies Story
export const Range = {
  args: {
    mode: 'range',
    defaultMonth: today,
    today,
    selected: { from: new Date(2026, 0, 12), to: new Date(2026, 0, 19) },
  },
} satisfies Story
export const DisabledDays = {
  args: {
    mode: 'single',
    defaultMonth: today,
    today,
    disabled: { before: today },
  },
} satisfies Story
