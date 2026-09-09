import type { Meta, StoryObj } from '@storybook/react'
import { Button, Slot } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/Slot',
  component: Slot,
} satisfies Meta<typeof Slot>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  render: () => (
    <Slot className="w-full">
      <Button variant="secondary">Styles passed to the child</Button>
    </Slot>
  ),
} satisfies Story
