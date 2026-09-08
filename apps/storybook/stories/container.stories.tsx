import type { Meta, StoryObj } from '@storybook/react'
import { Container } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/Container',
  component: Container,
} satisfies Meta<typeof Container>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  args: {
    maxWidth: 'lg',
    className: 'border border-accent rounded-xl p-6',
    children: 'A centered container with a constrained maximum width.',
  },
} satisfies Story
export const FullWidth = {
  args: { ...Default.args, maxWidth: 'full' },
} satisfies Story
export const Narrow = {
  args: { ...Default.args, maxWidth: 'xs' },
} satisfies Story
