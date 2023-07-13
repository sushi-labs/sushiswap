// Input.stories.ts|tsx

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
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
    id: 'input',
    placeholder: 'Example',
  },
} satisfies Story

export const Numeric = {
  args: {
    id: 'input',
    type: 'number',
    maxDecimals: 2,
  },
} satisfies Story

export const Percent = {
  args: {
    id: 'input',
    type: 'percent',
    maxDecimals: 2,
  },
} satisfies Story

export const Icon = {
  args: {
    id: 'input',
    icon: MagnifyingGlassIcon,
    placeholder: 'Search',
  },
} satisfies Story
