// Input.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import { ChipInput } from '@sushiswap/ui'
import { useState } from 'react'

const meta = {
  title: 'Primitives/ChipInput',
  component: ChipInput,
  args: {
    placeholder: 'placeholder',
  },
  argTypes: {
    placeholder: {
      control: { type: 'text' },
    },
    variant: {
      options: ['default', 'outline'],
      control: { type: 'select' },
    },
  },
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof ChipInput>

export default meta
type Story = StoryObj<typeof ChipInput>

export const Default = {
  args: {
    variant: 'default',
  },
  render: (args) => {
    const [blacklist, setBlacklist] = useState<string[]>([])
    return (
      <ChipInput
        {...args}
        delimiters={[',', ' ', ';', ':']}
        values={blacklist}
        onValueChange={setBlacklist}
      />
    )
  },
} satisfies Story

export const Outline = {
  args: {
    variant: 'outline',
  },
  render: (args) => {
    const [blacklist, setBlacklist] = useState<string[]>([])
    return (
      <ChipInput
        {...args}
        delimiters={[',', ' ', ';', ':']}
        values={blacklist}
        onValueChange={setBlacklist}
      />
    )
  },
} satisfies Story
