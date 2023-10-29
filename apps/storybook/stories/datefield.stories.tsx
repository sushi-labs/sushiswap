// Input.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import { DateField } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/DateField',
  component: DateField,
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
