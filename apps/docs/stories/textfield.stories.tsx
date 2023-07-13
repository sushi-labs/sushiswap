// Input.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import { TextField } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/TextField',
  component: TextField,
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof TextField>

export const Default = {
  args: {
    label: 'Label',
    id: 'input',
    placeholder: 'Example',
  },
} satisfies Story

export const Numeric = {
  args: {
    label: 'Label',
    id: 'input',
    type: 'number',
    maxDecimals: 2,
  },
} satisfies Story

export const Percent = {
  args: {
    label: 'Label',
    id: 'input',
    type: 'percent',
    maxDecimals: 2,
  },
} satisfies Story
