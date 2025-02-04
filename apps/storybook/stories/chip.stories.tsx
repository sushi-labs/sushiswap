// Chip.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import { Chip, type ChipProps } from '@sushiswap/ui'
import { DiscordIcon } from '@sushiswap/ui/icons/DiscordIcon'
import * as React from 'react'

import { ViewGroup } from '../components/View'

const variants: ChipProps['variant'][] = [
  'default',
  'secondary',
  'destructive',
  'ghost',
  'outline',
]

const meta = {
  title: 'Primitives/Chip',
  component: Chip,
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
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof Chip>

export const Default = {
  args: {
    children: 'Chip',
  },
} satisfies Story

export const Variants = (args) => {
  const items = variants.map((variant) => (
    <React.Fragment key={variant}>
      <Chip {...args} variant={variant}>
        {variant}
      </Chip>
    </React.Fragment>
  ))

  return <ViewGroup direction="row">{items}</ViewGroup>
}

export const WithIcon = (args) => {
  const items = variants.map((variant) => (
    <React.Fragment key={variant}>
      <Chip {...args} icon={DiscordIcon} variant={variant}>
        {variant}
      </Chip>
    </React.Fragment>
  ))

  return <ViewGroup direction="row">{items}</ViewGroup>
}
