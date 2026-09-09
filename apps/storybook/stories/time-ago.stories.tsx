import type { Meta, StoryObj } from '@storybook/react'
import { TimeAgo } from '@sushiswap/ui'
import { withFixedTime } from '../components/fixed-time'
const meta = {
  title: 'Primitives/TimeAgo',
  component: TimeAgo,
  beforeEach: withFixedTime,
} satisfies Meta<typeof TimeAgo>

export default meta
type Story = StoryObj<typeof meta>

export const Recent = {
  args: { value: new Date('2026-01-15T11:55:00.000Z') },
} satisfies Story
export const Yesterday = {
  args: { value: new Date('2026-01-14T12:00:00.000Z') },
} satisfies Story
