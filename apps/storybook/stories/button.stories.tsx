// Button.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import { Button, type ButtonProps } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui'
import { DiscordIcon } from '@sushiswap/ui/icons/DiscordIcon'
import * as React from 'react'
import { ChainId } from 'sushi/chain'
import { SUSHI } from 'sushi/currency'

import { ViewGroup } from '../components/View'

const variants: ButtonProps['variant'][] = [
  'default',
  'secondary',
  'destructive',
  'ghost',
  'outline',
  'link',
]
const sizes: ButtonProps['size'][] = ['xs', 'sm', 'default', 'lg', 'xl']

const meta = {
  title: 'Primitives/Button',
  component: Button,
  argTypes: {
    variant: {
      options: variants,
      control: { type: 'select' },
    },
    size: {
      options: sizes,
      control: { type: 'select' },
    },
    loading: {
      options: [true, false],
      control: { type: 'radio' },
    },
    disabled: {
      options: [true, false],
      control: { type: 'radio' },
    },
  },
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof Button>

export const Default = {
  args: {
    children: 'Button',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/wz1kpOOhMVEjqthxup2RDZ/Untitled?type=design&node-id=1-1267&mode=design&t=IL44c76uveATLFR8-4',
    },
  },
} satisfies Story

export const Variants = (args) => {
  const items = variants.map((variant) => (
    <React.Fragment key={variant}>
      <Button {...args} key={variant} variant={variant}>
        {variant}
      </Button>
    </React.Fragment>
  ))

  return <ViewGroup direction="row">{items}</ViewGroup>
}

export const Sizes = (args) => {
  const items = sizes.map((size) => (
    <React.Fragment key={size}>
      <Button {...args} key={size} size={size}>
        Size {size}
      </Button>
    </React.Fragment>
  ))

  return <ViewGroup direction="row">{items}</ViewGroup>
}

export const Loading = (args) => {
  const items = [true, false].map((loading, i) => (
    <React.Fragment key={i}>
      <Button {...args} key={loading} loading={loading}>
        {loading ? 'Loading' : 'Not Loading'}
      </Button>
    </React.Fragment>
  ))

  return <ViewGroup direction="row">{items}</ViewGroup>
}

export const WithIcon = (args) => {
  const items = sizes.map((size) => (
    <React.Fragment key={size}>
      <Button icon={DiscordIcon} {...args} key={size} size={size}>
        Size {size}
      </Button>
    </React.Fragment>
  ))

  const items2 = sizes.map((size) => (
    <React.Fragment key={size}>
      <Button
        icon={Currency.Icon}
        iconProps={{ currency: SUSHI[ChainId.ETHEREUM], width: 20, height: 20 }}
        {...args}
        key={size}
        size={size}
      >
        Size {size}
      </Button>
    </React.Fragment>
  ))

  return (
    <ViewGroup direction="row">
      {items}
      {items2}
    </ViewGroup>
  )
}
