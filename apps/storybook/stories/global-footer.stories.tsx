import type { Meta, StoryObj } from '@storybook/react'
import { GlobalFooter } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/GlobalFooter',
  component: GlobalFooter,
  parameters: {
    layout: 'fullscreen',
    chromatic: {
      modes: {
        'light mobile': { disable: true },
        'dark mobile': { disable: true },
        'black mobile': { disable: true },
      },
    },
  },
} satisfies Meta<typeof GlobalFooter>

export default meta
type Story = StoryObj<typeof meta>

export const Default = { args: {} } satisfies Story
export const WithContent = {
  args: {
    children: (
      <p className="mb-6 text-sm">
        Trade and provide liquidity across networks.
      </p>
    ),
  },
} satisfies Story
