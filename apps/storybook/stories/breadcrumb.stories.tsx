import type { Meta, StoryObj } from '@storybook/react'
import { Breadcrumb } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/pool/ethereum/position-123',
        query: { tab: 'positions' },
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Default = { args: {} } satisfies Story
export const ReplacedSegments = {
  args: {
    replace: { ethereum: 'Ethereum network', 'position-123': 'ETH / USDC' },
    truncate: false,
  },
} satisfies Story
