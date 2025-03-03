// IconButton.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import { IconButton, type IconButtonProps } from '@sushiswap/ui'
import { DiscordIcon } from '@sushiswap/ui/icons/DiscordIcon'
import * as React from 'react'

import { ViewGroup } from '../components/View'

const variants: IconButtonProps['variant'][] = [
  'default',
  'secondary',
  'destructive',
  'ghost',
  'outline',
  'link',
]
const sizes: IconButtonProps['size'][] = ['xs', 'sm', 'default', 'lg', 'xl']

const meta = {
  title: 'Primitives/IconButton',
  component: IconButton,
  argTypes: {
    variant: {
      options: variants,
      control: { type: 'select' },
    },
    size: {
      options: sizes,
      control: { type: 'select' },
    },
  },
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof IconButton>

export const Default = {
  args: {
    icon: DiscordIcon,
  },
} satisfies Story

export const Variants = (args) => {
  const items = variants.map((variant) => (
    <React.Fragment key={variant}>
      <IconButton
        icon={DiscordIcon}
        {...args}
        key={variant}
        variant={variant}
      />
    </React.Fragment>
  ))

  return <ViewGroup direction="row">{items}</ViewGroup>
}

export const Sizes = (args) => {
  const items = sizes.map((size) => (
    <React.Fragment key={size}>
      <IconButton icon={DiscordIcon} {...args} key={size} size={size} />
    </React.Fragment>
  ))

  return <ViewGroup direction="row">{items}</ViewGroup>
}
