// Button.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import { Message, type MessageProps } from '@sushiswap/ui'
import * as React from 'react'

import { ViewGroup } from '../components/View'

const variants: MessageProps['variant'][] = [
  'info',
  'destructive',
  'warning',
  'muted',
  'success',
]
const sizes: MessageProps['size'][] = ['xs', 'sm', 'default']

const meta = {
  title: 'Primitives/Message',
  component: Message,
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
} satisfies Meta<typeof Message>

export default meta
type Story = StoryObj<typeof Message>

export const Default = {
  args: {
    children:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
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
      <Message {...args} key={variant} variant={variant}>
        Lorem Ipsum has been the industry's standard dummy text ever since the
        1500s, when an unknown printer took a galley of type and scrambled it to
        make a type specimen book
      </Message>
    </React.Fragment>
  ))

  return <ViewGroup direction="row">{items}</ViewGroup>
}

export const Sizes = (args) => {
  const items = sizes.map((size) => (
    <React.Fragment key={size}>
      <Message {...args} key={size} size={size}>
        Lorem Ipsum has been the industry's standard dummy text ever since the
        1500s, when an unknown printer took a galley of type and scrambled it to
        make a type specimen book
      </Message>
    </React.Fragment>
  ))

  return <ViewGroup direction="row">{items}</ViewGroup>
}
