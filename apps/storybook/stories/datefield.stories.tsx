// Input.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import { DateField } from '@sushiswap/ui'
import { withFixedTime } from '../components/fixed-time'

const meta = {
  title: 'Primitives/DateField',
  component: DateField,
  beforeEach: withFixedTime,
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof DateField>

export default meta
type Story = StoryObj<typeof DateField>

export const Default = {
  args: {
    id: 'input',
  },
} satisfies Story

export const Selected = {
  args: {
    id: 'selected-date',
    selected: new Date(2026, 0, 15),
    dateFormat: 'yyyy-MM-dd',
  },
} satisfies Story

export const Open = {
  args: { ...Selected.args, open: true },
} satisfies Story
