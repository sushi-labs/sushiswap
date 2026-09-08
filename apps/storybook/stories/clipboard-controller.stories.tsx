import type { Meta, StoryObj } from '@storybook/react'
import { Button, ClipboardController } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/ClipboardController',
  component: ClipboardController,
} satisfies Meta<typeof ClipboardController>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  args: {
    children: ({ isCopied, setCopied }) => (
      <Button variant="secondary" onClick={() => setCopied('Sushi')}>
        {isCopied ? 'Copied!' : 'Copy token name'}
      </Button>
    ),
  },
} satisfies Story
export const WithoutTooltip = {
  args: { ...Default.args, hideTooltip: true },
} satisfies Story
