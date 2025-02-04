// Toggle.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import { Toggle, type ToggleProps } from '@sushiswap/ui'
import * as React from 'react'

import { ViewGroup } from '../components/View'

const variants: ToggleProps['variant'][] = ['default', 'outline']
const sizes: ToggleProps['size'][] = ['xs', 'sm', 'default', 'lg']

const meta = {
  title: 'Primitives/Toggle',
  component: Toggle,
  argTypes: {
    variant: {
      options: variants,
      control: { type: 'select' },
    },
    size: {
      options: sizes,
      control: { type: 'select' },
    },
    pressed: {
      options: [true, false],
      control: { type: 'boolean' },
    },
  },
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof Toggle>

export const Default = {
  args: {
    children: 'Toggle',
  },
} satisfies Story

export const Sizes = (args) => {
  const items = sizes.map((size) => (
    <React.Fragment key={size}>
      <Toggle {...args} key={size} size={size}>
        Size {size}
      </Toggle>
    </React.Fragment>
  ))

  return <ViewGroup direction="row">{items}</ViewGroup>
}

export const Variants = (args) => {
  const items = variants.map((variant) => (
    <React.Fragment key={variant}>
      <Toggle {...args} key={variant} variant={variant}>
        Variant {variant}
      </Toggle>
    </React.Fragment>
  ))

  return <ViewGroup direction="row">{items}</ViewGroup>
}
